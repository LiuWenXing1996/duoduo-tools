<template>
    <tool-content :vertical="{
        enabled: true,
        top: {
            class: '!h-[20%]'
        },
        bottom: {
            class: '!h-[80%]'
        }
    }" :output="{
        scroll: {
            disabled: true
        },
        area: {
            label: '对比'
        }
    }">
        <template #output>
            <div class="relative size-full ">
                <div class="absolute top-0 bottom-0 left-0 right-0">
                    <n-spin :show="monacoLoader.loading.value" size="small" class="size-full" content-class="size-full">
                        <div ref="editorContainer" class="size-full"></div>
                    </n-spin>
                </div>
            </div>
        </template>
    </tool-content>
</template>
<script setup lang="ts">
import type * as monacoType from 'monaco-editor';

const monacoLoader = useMonacoLoader();
monacoLoader.get()
const editorContainerRef = useTemplateRef("editorContainer");
let editor: monacoType.editor.IStandaloneDiffEditor | null = null;

const keepSomeActions = (editor: monacoType.editor.IStandaloneCodeEditor) => {
    const keepIds = [
        "editor.action.clipboardCutAction",
        "editor.action.clipboardCopyAction",
        "editor.action.clipboardPasteAction",
    ];
    const contextmenu = editor.getContribution('editor.contrib.contextmenu');
    // @ts-ignore
    const realMethod = contextmenu?._getMenuActions || [];
    // @ts-ignore
    contextmenu._getMenuActions = function () {
        const items = realMethod.apply(contextmenu, arguments);
        return items.filter(function (item: any) {
            return keepIds.includes(item.id);
        });
    };
}

watch([
    () => monacoLoader.lib.value,
    () => editorContainerRef.value
], ([monaco, editorContainer]) => {
    if (editor) {
        return
    }

    if (monaco && editorContainer) {
        editor = monaco.editor.createDiffEditor(editorContainer, {
            originalEditable: true,
            useInlineViewWhenSpaceIsLimited: false,
            minimap: {
                enabled: false,
            },
        });
        keepSomeActions(editor.getOriginalEditor())
        keepSomeActions(editor.getModifiedEditor())
        editor.setModel({
            original: monaco.editor.createModel(`文本
对比 
123`, 'txt'),
            modified: monaco.editor.createModel(`文本
比对
321`, 'txt'),
        });
    }
})

useResizeObserver(editorContainerRef, async (entries) => {
    const entry = entries[0]
    const { width, height } = entry.contentRect;
    editor?.layout({
        width, height
    });
});
</script>