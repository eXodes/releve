export type PartialByKeys<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>;
