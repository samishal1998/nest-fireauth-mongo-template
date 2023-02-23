export type DeepRequired<T> = Required<{
	[K in keyof T]: T[K] extends object ? DeepRequired<T[K]> : T[K];
}>;
