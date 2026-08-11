export type DownloadPngParams = {
  width: number;
  ext: "png" | "jpg";
  bgColor: string;
};

export type TargetWindowMethods = {
  downloadPng: (params: DownloadPngParams) => Promise<void>;
  changeThemePreference: (preference: string) => void;
  setEditorHeight: (height: number) => void;
  setValue: (value: string) => void;
  getValue: () => string;
  onResize: (fn: (data: { height: number; width: number }) => void) => void;
  getEditorContainerRect: () =>
    | {
        height: number;
        width: number;
        top: number;
        left: number;
      }
    | undefined;
};
const WangEditorMethodsKey = "WangEditorMethods";
export const setMethods = (
  targetWindow: Window,
  methods: TargetWindowMethods
) => {
  // @ts-ignore
  targetWindow[WangEditorMethodsKey] = methods;
};
export const getMethods = (
  targetWindow: Window
): TargetWindowMethods | undefined => {
  // @ts-ignore
  return targetWindow[WangEditorMethodsKey];
};
