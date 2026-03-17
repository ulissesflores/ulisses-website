/**
 * ═══════════════════════════════════════════════════════════════════════════════
 *  🌐 i18n.config.mjs — Single Source of Truth for i18n Configuration
 * ───────────────────────────────────────────────────────────────────────────────
 *  Centraliza TODAS as configurações de localização para scripts Node.js (.mjs).
 *  A contraparte TypeScript para o Next.js é `data/i18n.ts`.
 *
 *  REGRA ABSOLUTA: Nenhum script fora deste ficheiro pode definir arrays de locales.
 *  O teste `anti-dry.test.ts` garante esta regra automaticamente.
 *
 *  Lote 22 — Erradicação DRY (ADR-0002/0003)
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// ── All Locales (including source pt-br) ────────────────────────────────────
export const DEFAULT_LOCALE = 'pt-br';
export const ALL_LOCALES = ['pt-br', 'en', 'es', 'it', 'he'];

// ── Target Locales (translation targets, excludes source pt-br) ─────────────
export const TARGET_LOCALES = ['en', 'es', 'it', 'he'];

export const TARGET_LOCALES_RICH = [
  { code: 'en', label: 'English', dir: 'ltr' },
  { code: 'es', label: 'Spanish (Castilian)', dir: 'ltr' },
  { code: 'it', label: 'Italian', dir: 'ltr' },
  { code: 'he', label: 'Hebrew', dir: 'rtl' },
];

export const LOCALE_LABELS = {
  en: 'English',
  es: 'Spanish',
  it: 'Italian',
  he: 'Hebrew',
};

// ── Cognates ────────────────────────────────────────────────────────────────────
// Loaded from cognates.json (separação de configuração e lógica)

const cognatesPath = join(__dirname, 'cognates.json');
const cognatesData = JSON.parse(readFileSync(cognatesPath, 'utf-8'));

/** Termos técnicos/nomes próprios idênticos em TODOS os idiomas */
export const GLOBAL_ALLOWLIST = new Set(cognatesData.globalAllowlist);

/** Cognatos PT-ES: strings legitimamente idênticas em Português E Espanhol */
export const PT_ES_COGNATES = new Set(cognatesData.ptEsCognates);

/** Cognatos PT-IT: strings legitimamente idênticas em Português E Italiano */
export const PT_IT_COGNATES = new Set(cognatesData.ptItCognates);

/** Namespaces a ignorar no identity check (FAQ tem falsos positivos) */
export const SKIP_IDENTITY_NAMESPACES = new Set(cognatesData.skipIdentityNamespaces);
