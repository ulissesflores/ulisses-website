import { Cinzel, Fahkwang, Noto_Sans_Hebrew, Noto_Serif_Hebrew } from 'next/font/google';

/*
 * Fontes da marca (manual ULISSES.pdf), carregadas pelo layout — a adoção é do
 * site inteiro desde a F2 (NOVO-SITE-STATE-2026-08-01.md). As quatro variáveis
 * alimentam os stacks `--font-display` e `--font-ui` do globals.css; as duas
 * hebraicas só entram no `he`, que é o único locale que precisa dos glifos.
 */

export const cinzel = Cinzel({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-cinzel',
});

export const fahkwang = Fahkwang({
  subsets: ['latin'],
  // 700 carregado desde o lote 7 da F4: títulos/ênfases dos charts SVG pedem
  // bold real — sem ele o browser sintetiza (faux bold) com métrica falsa,
  // o que invalida a medição de largura de rótulos do acervo.
  weight: ['300', '400', '500', '700'],
  display: 'swap',
  variable: '--font-fahkwang',
});

export const notoSansHebrew = Noto_Sans_Hebrew({
  subsets: ['hebrew'],
  weight: ['400', '700'],
  display: 'swap',
  variable: '--font-hebrew',
});

/* Cinzel não tem glifos hebraicos: o locale `he` declara esta serifada como
 * display — no stack `--font-display` ela entra logo após a Cinzel, então
 * texto latino (o nome próprio) continua Cinzel e o hebraico cai aqui. */
export const notoSerifHebrew = Noto_Serif_Hebrew({
  subsets: ['hebrew'],
  display: 'swap',
  variable: '--font-hebrew-display',
});
