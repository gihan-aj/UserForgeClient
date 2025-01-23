export type MessagePath<T> = T extends object
  ? {
      [K in keyof T & string]: K | `${K}.${MessagePath<T[K]>}`;
    }[keyof T & string]
  : never;
