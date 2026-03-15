import ptBrDict from './pt-br';

/**
 * Recursively widen literal types and remove readonly modifiers
 * so that translated dictionaries with different string content
 * still satisfy the structural contract.
 *
 * - string literals → `string`
 * - number literals → `number`
 * - boolean literals → `boolean`
 * - readonly arrays/tuples → `Widen<U>[]`
 * - objects → `{ [K]: Widen<V> }` (removes readonly)
 */
type Widen<T> =
  T extends string
    ? string
    : T extends number
      ? number
      : T extends boolean
        ? boolean
        : T extends readonly (infer U)[]
          ? Widen<U>[]
          : T extends object
            ? { -readonly [K in keyof T]: Widen<T[K]> }
            : T;

/**
 * Dictionary type inferred from the pt-BR ground truth.
 * All other locales MUST satisfy this exact shape (same keys),
 * but string values may differ (translated content).
 */
export type Dictionary = Widen<typeof ptBrDict>;
