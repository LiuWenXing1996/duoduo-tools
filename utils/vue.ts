export type MappingEmits<T extends Record<string, any>> = {
  [k in keyof T as `on${Capitalize<string & k>}`]?: (...args: T[k]) => void;
};

export type ExpandProps<E extends Record<string, any>> = MappingEmits<E>;