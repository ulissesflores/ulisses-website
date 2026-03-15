import ptBrDict from './pt-br';

/**
 * Dictionary type inferred from the pt-BR ground truth.
 * All other locales MUST satisfy this exact shape.
 */
export type Dictionary = typeof ptBrDict;
