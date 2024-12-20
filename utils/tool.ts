export interface ToolMeta {
  title: string;
  description: string;
  category: string;
  auth?: ToolMetaAuth;
  related?: (
    | {
        title: string;
        url: string;
      }
    | string
  )[];
}

export enum ToolMetaAuth {
  "user" = "user",
  "admin" = "admin",
  "super" = "super",
}

export const defineToolMeta = (meta: ToolMeta) => meta;
