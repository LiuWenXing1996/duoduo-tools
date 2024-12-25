<template>
    <div class="relative size-full ">
        <div class="absolute top-0 bottom-0 left-0 right-0">
            <n-spin :show="monacoLoader.loading.value" size="small" class="size-full" content-class="size-full">
                <div ref="editorContainer" class="size-full"></div>
            </n-spin>
        </div>
    </div>
</template>
<script setup lang="ts" generic="T extends monacoType.editor.IEditor">
import type * as monacoType from 'monaco-editor';

export type InitParams = {
    monaco: typeof monacoType,
    editorContainer: HTMLDivElement
}

export type Props<T extends monacoType.editor.IEditor> = {
    init: (params: InitParams) => MaybePromise<T>;
    contextMenuActions?: MonacoEditorContextMenuAction[]
}

const props = defineProps<Props<T>>()

const monacoLoader = useMonacoLoader();
monacoLoader.get()

const editorContainerRef = useTemplateRef("editorContainer");
const editor = shallowRef<T | null>(null)

watch([
    () => monacoLoader.lib.value,
    () => editorContainerRef.value
], async ([monaco, editorContainer]) => {
    if (editor.value) {
        return
    }

    if (monaco && editorContainer) {
        editor.value = await props.init({ monaco, editorContainer })
    }
}, {
    immediate: true,
    flush: "post"
})

watch([
    () => props.contextMenuActions,
    () => editor.value
], ([actions, editor]) => {
    if (editor) {
        enabledContextMenuActions(editor, actions || [])
    }
})


useResizeObserver(editorContainerRef, async (entries) => {
    const entry = entries[0]
    const { width, height } = entry.contentRect;
    editor.value?.layout({
        width, height
    });
});

</script>