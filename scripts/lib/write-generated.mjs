import fs from 'node:fs';

/*
 * Carimbo de data dos artefatos gerados, nas três formas em que ele aparece:
 * chave JSON, linha de markdown e cabeçalho de arquivo .ts.
 */
const STAMP = /("generatedAt":\s*")[^"]*"|(Generated at: )\S+/g;
const PLACEHOLDER = '<carimbo>';

const semCarimbo = (texto) => texto.replace(STAMP, PLACEHOLDER);

/**
 * Escreve o artefato só quando o CONTEÚDO muda. Se a única diferença para o que
 * está em disco é o carimbo de data, o arquivo fica como está: senão todo
 * `sota:check` sujaria a árvore com um diff de uma linha e zero informação.
 * Devolve `true` quando gravou.
 */
export function writeGenerated(file, content) {
  if (fs.existsSync(file) && semCarimbo(fs.readFileSync(file, 'utf8')) === semCarimbo(content)) {
    return false;
  }
  fs.writeFileSync(file, content);
  return true;
}
