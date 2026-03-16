import { describe, it, expect } from 'vitest';

/**
 * Unit tests for the validate-parity.mjs logic.
 * Tests the core detection functions (MISSING_KEY, EMPTY_VALUE, STUB_COPY)
 * using mock dictionary objects.
 */

// ─── Replicate the core logic from validate-parity.mjs for unit testing ───

function flattenObject(obj, prefix = '') {
  const result = {};
  for (const [key, value] of Object.entries(obj)) {
    const path = prefix ? `${prefix}.${key}` : key;
    if (value === null || value === undefined) {
      result[path] = '';
    } else if (Array.isArray(value)) {
      value.forEach((item, i) => {
        if (typeof item === 'object' && item !== null) {
          Object.assign(result, flattenObject(item, `${path}[${i}]`));
        } else {
          result[`${path}[${i}]`] = String(item);
        }
      });
    } else if (typeof value === 'object') {
      Object.assign(result, flattenObject(value, path));
    } else {
      result[path] = String(value);
    }
  }
  return result;
}

type Issue = { type: string; key: string; ptValue: string; foreignValue: string };

function validateParity(
  ptDict: Record<string, unknown>,
  foreignDict: Record<string, unknown>,
  exemptValues: Set<string> = new Set(),
): Issue[] {
  const ptFlat = flattenObject(ptDict);
  const foreignFlat = flattenObject(foreignDict);
  const issues: Issue[] = [];

  for (const [keyPath, ptValue] of Object.entries(ptFlat)) {
    if (!(keyPath in foreignFlat)) {
      issues.push({ type: 'MISSING_KEY', key: keyPath, ptValue, foreignValue: '' });
      continue;
    }
    const foreignValue = foreignFlat[keyPath];
    if (foreignValue.trim().length === 0) {
      issues.push({ type: 'EMPTY_VALUE', key: keyPath, ptValue, foreignValue });
      continue;
    }
    if (foreignValue === ptValue && !exemptValues.has(ptValue)) {
      issues.push({ type: 'STUB_COPY', key: keyPath, ptValue, foreignValue });
      continue;
    }
  }

  for (const keyPath of Object.keys(foreignFlat)) {
    if (!(keyPath in ptFlat)) {
      issues.push({ type: 'EXTRA_KEY', key: keyPath, ptValue: '', foreignValue: foreignFlat[keyPath] });
    }
  }

  return issues;
}

// ─── Tests ───

describe('flattenObject', () => {
  it('flattens a simple nested object', () => {
    const result = flattenObject({ a: { b: 'hello', c: 'world' } });
    expect(result).toEqual({ 'a.b': 'hello', 'a.c': 'world' });
  });

  it('flattens arrays with indices', () => {
    const result = flattenObject({ items: ['one', 'two'] });
    expect(result).toEqual({ 'items[0]': 'one', 'items[1]': 'two' });
  });

  it('flattens arrays of objects', () => {
    const result = flattenObject({
      faq: [{ question: 'Q1', answer: 'A1' }],
    });
    expect(result).toEqual({ 'faq[0].question': 'Q1', 'faq[0].answer': 'A1' });
  });

  it('handles null / undefined as empty string', () => {
    const result = flattenObject({ a: null, b: undefined });
    expect(result).toEqual({ a: '', b: '' });
  });

  it('converts numbers and booleans to string', () => {
    const result = flattenObject({ count: 42, active: true });
    expect(result).toEqual({ count: '42', active: 'true' });
  });

  it('handles deeply nested structures', () => {
    const result = flattenObject({ a: { b: { c: { d: 'deep' } } } });
    expect(result).toEqual({ 'a.b.c.d': 'deep' });
  });
});

describe('validateParity — MISSING_KEY detection', () => {
  it('detects a missing key', () => {
    const pt = { title: 'Olá', subtitle: 'Mundo' };
    const foreign = { title: 'Hello' };
    const issues = validateParity(pt, foreign);
    expect(issues).toContainEqual(
      expect.objectContaining({ type: 'MISSING_KEY', key: 'subtitle' }),
    );
  });

  it('detects missing nested keys', () => {
    const pt = { nav: { home: 'Início', about: 'Sobre' } };
    const foreign = { nav: { home: 'Home' } };
    const issues = validateParity(pt, foreign);
    expect(issues).toContainEqual(
      expect.objectContaining({ type: 'MISSING_KEY', key: 'nav.about' }),
    );
  });

  it('returns no issues when keys match', () => {
    const pt = { title: 'Olá' };
    const foreign = { title: 'Hello' };
    const issues = validateParity(pt, foreign);
    expect(issues).toEqual([]);
  });
});

describe('validateParity — EMPTY_VALUE detection', () => {
  it('detects an empty string value', () => {
    const pt = { title: 'Olá' };
    const foreign = { title: '' };
    const issues = validateParity(pt, foreign);
    expect(issues).toContainEqual(
      expect.objectContaining({ type: 'EMPTY_VALUE', key: 'title' }),
    );
  });

  it('detects whitespace-only value as empty', () => {
    const pt = { title: 'Olá' };
    const foreign = { title: '   ' };
    const issues = validateParity(pt, foreign);
    expect(issues).toContainEqual(
      expect.objectContaining({ type: 'EMPTY_VALUE', key: 'title' }),
    );
  });
});

describe('validateParity — STUB_COPY detection', () => {
  it('detects when foreign value equals PT value (stub)', () => {
    const pt = { greeting: 'Bom dia' };
    const foreign = { greeting: 'Bom dia' }; // NOT translated!
    const issues = validateParity(pt, foreign);
    expect(issues).toContainEqual(
      expect.objectContaining({ type: 'STUB_COPY', key: 'greeting' }),
    );
  });

  it('skips exempt values', () => {
    const pt = { brand: 'GoldenLeaf' };
    const foreign = { brand: 'GoldenLeaf' };
    const exempt = new Set(['GoldenLeaf']);
    const issues = validateParity(pt, foreign, exempt);
    expect(issues).toEqual([]);
  });

  it('detects stub even in nested objects', () => {
    const pt = { nav: { label: 'Publicações' } };
    const foreign = { nav: { label: 'Publicações' } };
    const issues = validateParity(pt, foreign);
    expect(issues).toContainEqual(
      expect.objectContaining({ type: 'STUB_COPY', key: 'nav.label' }),
    );
  });

  it('does not flag genuinely different translations', () => {
    const pt = { greeting: 'Bom dia', farewell: 'Adeus' };
    const foreign = { greeting: 'Good morning', farewell: 'Goodbye' };
    const issues = validateParity(pt, foreign);
    expect(issues).toEqual([]);
  });
});

describe('validateParity — EXTRA_KEY detection', () => {
  it('detects extra keys in foreign dict', () => {
    const pt = { title: 'Olá' };
    const foreign = { title: 'Hello', extra: 'Something new' };
    const issues = validateParity(pt, foreign);
    expect(issues).toContainEqual(
      expect.objectContaining({ type: 'EXTRA_KEY', key: 'extra' }),
    );
  });
});

describe('validateParity — complex real-world scenarios', () => {
  it('handles FAQ-style arrays correctly', () => {
    const pt = {
      faq: [
        { question: 'O que é?', answer: 'É um projeto.' },
        { question: 'Como funciona?', answer: 'Funciona bem.' },
      ],
    };
    const foreign = {
      faq: [
        { question: 'What is it?', answer: 'It is a project.' },
        { question: 'How does it work?', answer: 'It works well.' },
      ],
    };
    const issues = validateParity(pt, foreign);
    expect(issues).toEqual([]);
  });

  it('detects partial translation (some keys translated, others stubbed)', () => {
    const pt = { nav: { home: 'Início', about: 'Sobre', contact: 'Contato' } };
    const foreign = { nav: { home: 'Home', about: 'Sobre', contact: 'Contact' } };
    const issues = validateParity(pt, foreign);
    expect(issues).toHaveLength(1);
    expect(issues[0]).toMatchObject({ type: 'STUB_COPY', key: 'nav.about' });
  });

  it('handles mixed issues (missing + empty + stub)', () => {
    const pt = { a: 'Olá', b: 'Mundo', c: 'Teste' };
    const foreign = { a: '', c: 'Teste' }; // b missing, a empty, c stub
    const issues = validateParity(pt, foreign);

    const types = issues.map(i => i.type).sort();
    expect(types).toContain('MISSING_KEY');
    expect(types).toContain('EMPTY_VALUE');
    expect(types).toContain('STUB_COPY');
  });
});
