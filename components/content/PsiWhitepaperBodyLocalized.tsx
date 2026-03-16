import type { Locale } from '@/data/i18n';
import { PsiWhitepaperBody } from './PsiWhitepaperBody';
import { PsiWhitepaperBody as PsiWhitepaperBodyEN } from './PsiWhitepaperBody.en';
import { PsiWhitepaperBody as PsiWhitepaperBodyES } from './PsiWhitepaperBody.es';
import { PsiWhitepaperBody as PsiWhitepaperBodyIT } from './PsiWhitepaperBody.it';
import { PsiWhitepaperBody as PsiWhitepaperBodyHE } from './PsiWhitepaperBody.he';

interface Props {
  locale: Locale;
  includeFigures?: boolean;
}

const COMPONENTS: Record<string, typeof PsiWhitepaperBody> = {
  'pt-br': PsiWhitepaperBody,
  en: PsiWhitepaperBodyEN,
  es: PsiWhitepaperBodyES,
  it: PsiWhitepaperBodyIT,
  he: PsiWhitepaperBodyHE,
};

export function PsiWhitepaperBodyLocalized({ locale, includeFigures }: Props) {
  const Component = COMPONENTS[locale] ?? PsiWhitepaperBody;
  return <Component locale={locale} includeFigures={includeFigures} />;
}
