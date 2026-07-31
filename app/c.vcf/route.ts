import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { upkfMeta } from '@/data/generated/upkf.generated';
import { cardLinks, contactEmail, whatsappNumber, portrait, cardTitle } from '@/data/contact-card';

/**
 * vCard servido em `https://ulissesflores.com/c.vcf` — o "Salvar contato" da rota `/c`.
 *
 * Fica FORA de `app/[locale]/` de propósito: esta URL vai gravada no chip NFC e no QR,
 * então não pode mudar de forma quando o idioma muda. Um contato telefônico não é
 * localizável de qualquer maneira.
 *
 * **vCard 3.0, não 4.0.** O 3.0 é o formato de exportação padrão do Google Contacts,
 * iCloud e Outlook e é lido por praticamente qualquer aparelho; o 4.0 tem suporte
 * inconsistente e há aparelhos que ignoram campos ou falham em parsear o contato
 * inteiro. Num cartão de visita, um contato que não importa é o fracasso total do
 * objeto. (Pesquisa registrada em CARTAO-STATE-2026-07-30.md.)
 *
 * `force-static` de propósito: no App Router um handler `GET` é dinâmico por padrão,
 * e isso viraria uma invocação de função a cada tap de NFC. Nada aqui depende da
 * requisição, então a rota é gerada no build.
 *
 * Sem `CHARSET=` por linha: isso é vCard 2.1 e é proibido em 3.0 — o charset vem
 * só do `Content-Type`. É a classe de erro que quebra parser de aparelho antigo
 * em silêncio.
 */
export const dynamic = 'force-static';

/** Dobra linhas em 75 octetos como manda a RFC 2426 §2.6. */
function fold(line: string): string {
  if (line.length <= 75) return line;
  const parts = [line.slice(0, 75)];
  let rest = line.slice(75);
  while (rest.length > 74) {
    parts.push(` ${rest.slice(0, 74)}`);
    rest = rest.slice(74);
  }
  if (rest) parts.push(` ${rest}`);
  return parts.join('\r\n');
}

/** Escapa vírgula, ponto-e-vírgula, barra e quebra de linha (RFC 2426 §5). */
function esc(value: string): string {
  return value.replace(/\\/g, '\\\\').replace(/([,;])/g, '\\$1').replace(/\n/g, '\\n');
}

/**
 * Retrato embutido em base64. Um contato salvo sem foto é meio cartão: a cara é
 * o que faz a pessoa lembrar de quem é você três semanas depois. `PHOTO` inline
 * evita depender de a agenda do celular ir buscar uma URL depois.
 */
function photoLine(): string | null {
  try {
    const bytes = readFileSync(join(process.cwd(), 'public', portrait));
    return `PHOTO;ENCODING=b;TYPE=JPEG:${bytes.toString('base64')}`;
  } catch {
    // Sem retrato o cartão continua válido — não vale derrubar o build por isso.
    return null;
  }
}

export function GET() {
  const name = upkfMeta.publicDisplayName || upkfMeta.displayName;
  const [given, ...familyParts] = name.split(' ');
  const family = familyParts.join(' ');

  const lines = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    `N:${esc(family)};${esc(given)};;;`,
    `FN:${esc(name)}`,
    `TITLE:${esc(cardTitle)}`,
    `EMAIL;TYPE=INTERNET,PREF:${esc(contactEmail)}`,
    ...(whatsappNumber ? [`TEL;TYPE=CELL,VOICE:+${whatsappNumber}`] : []),
    /*
     * Os mesmos 6 perfis da página, não o `sameAs` inteiro do UPKF. O `sameAs` tem
     * 17 entradas — TikTok, Facebook, Keybase, um tópico de fórum de 2011 — que
     * existem para desambiguar a entidade para rastreadores. Despejadas num contato
     * salvo, viram lixo na agenda de quem acabou de te conhecer.
     */
    ...cardLinks.map(({ href }) => `URL:${esc(href)}`),
    `NOTE:${esc(`ORCID 0000-0002-6034-7765 · Lattes 6905246706890561 · ${upkfMeta.primaryWebsite}/c`)}`,
    `SOURCE:${esc(`${upkfMeta.primaryWebsite}/c.vcf`)}`,
    photoLine(),
    'END:VCARD',
  ].filter((line): line is string => line !== null);

  const body = lines.map(fold).join('\r\n') + '\r\n';

  return new Response(body, {
    headers: {
      // Fora do alcance do middleware: o matcher exclui caminhos com extensão, então
      // nada aplica robots a esta URL por fora. O header vai aqui ou não vai.
      'X-Robots-Tag': 'noindex',
      // `text/vcard` é o tipo registrado; sem Content-Disposition alguns navegadores
      // mostram o vCard como texto cru em vez de oferecer a importação.
      // `filename` em ASCII simples porque o Safari trunca esse header (Apple FB #685138).
      'Content-Type': 'text/vcard; charset=utf-8',
      'Content-Disposition': 'attachment; filename="ulisses-flores.vcf"',
      'Cache-Control': 'public, max-age=3600, s-maxage=86400',
    },
  });
}
