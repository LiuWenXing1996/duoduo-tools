export interface ToolMeta {
  title: string;
  description: string;
  category: string;
  related?: (
    | {
        title: string;
        url: string;
      }
    | string
  )[];
}
export const defineToolMeta = (meta: ToolMeta) => meta;
