export type OptionalProps<T, R extends keyof T> = Omit<T, R> & Partial<Pick<T, R>>
