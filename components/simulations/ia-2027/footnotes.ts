import type { NarrativeSection, SimulationPath } from '@/components/simulations/ia-2027/types';

export type ProcessedNarrative = {
  sections: NarrativeSection[];
  firstReferenceByFootnote: Map<number, string>;
};

const SUP_FOOTNOTE_PATTERN = /<sup\b([^>]*)>\s*\[(\d+)\]\s*<\/sup>/gi;
const CARET_FOOTNOTE_PATTERN = /\[\^(\d+)\]/g;

function buildFootnoteAnchor(
  context: SimulationPath,
  num: number,
  count: number,
  supAttributes: string | null,
): { id: string; html: string } {
  const referenceId = `ref-${context}-${num}-${count}`;
  const targetId = `fn-${context}-${num}`;
  const attrs = supAttributes?.trim();
  const supOpenTag = attrs ? `<sup ${attrs}>` : '<sup>';

  return {
    id: referenceId,
    html: `${supOpenTag}<a href="#${targetId}" id="${referenceId}" class="font-semibold text-indigo-700 no-underline hover:underline">[${num}]</a></sup>`,
  };
}

export function processNarrativeFootnotes(
  sections: NarrativeSection[],
  context: SimulationPath,
): ProcessedNarrative {
  const counterByFootnote = new Map<number, number>();
  const firstReferenceByFootnote = new Map<number, string>();

  const processedSections = sections.map((section) => {
    const markReference = (numText: string, supAttributes: string | null) => {
      const num = Number(numText);
      if (!Number.isFinite(num) || num <= 0) {
        return null;
      }

      const count = (counterByFootnote.get(num) ?? 0) + 1;
      counterByFootnote.set(num, count);

      const anchor = buildFootnoteAnchor(context, num, count, supAttributes);
      if (!firstReferenceByFootnote.has(num)) {
        firstReferenceByFootnote.set(num, anchor.id);
      }
      return anchor.html;
    };

    const storyWithLinkedSup = section.storyHtml.replace(
      SUP_FOOTNOTE_PATTERN,
      (_fullMatch, attributes: string, numText: string) => markReference(numText, attributes) ?? _fullMatch,
    );

    const storyWithLinkedCaret = storyWithLinkedSup.replace(CARET_FOOTNOTE_PATTERN, (_fullMatch, numText: string) => {
      const replacement = markReference(numText, null);
      return replacement ?? _fullMatch;
    });

    return {
      ...section,
      storyHtml: storyWithLinkedCaret,
    };
  });

  return {
    sections: processedSections,
    firstReferenceByFootnote,
  };
}
