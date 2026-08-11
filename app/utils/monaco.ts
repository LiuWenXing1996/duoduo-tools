import type * as monacoType from "monaco-editor";

export enum MonacoEditorContextMenuAction {
  "editor.action.clipboardCutAction" = "editor.action.clipboardCutAction",
  "editor.action.clipboardCopyAction" = "editor.action.clipboardCopyAction",
  "editor.action.clipboardPasteAction" = "editor.action.clipboardPasteAction",
}

export const enabledContextMenuActions = (
  editor: monacoType.editor.IStandaloneCodeEditor,
  actions: MonacoEditorContextMenuAction[]
) => {
  const contextmenu = editor.getContribution("editor.contrib.contextmenu");
  // @ts-ignore
  const realMethod = contextmenu?._getMenuActions || [];
  // @ts-ignore
  contextmenu._getMenuActions = function () {
    const items = realMethod.apply(contextmenu, arguments);
    return items.filter(function (item: any) {
      return actions.includes(item.id);
    });
  };
};
