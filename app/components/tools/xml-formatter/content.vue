<template>
    <tool-content :output="{
        scroll: {
            disabled: true
        },
        area: {
            labelActions: [
                {
                    name: 'common-copy',
                    onClick: () => { copy(resRequest.data.value?.content || '') }
                }
            ]
        }
    }">
        <template #input>
            <n-form ref="form" :model="model">
                <tool-area label="输入">
                    <n-form-item :="commonFormItemProps" path="content" label="原始 XML">
                        <n-input type="textarea" :rows="4" clearable v-model:value="model.content" />
                    </n-form-item>
                    <n-form-item :="commonFormItemProps" path="collapseContent" label="折叠内容">
                        <n-switch v-model:value="model.collapseContent" />
                    </n-form-item>
                    <n-form-item :="commonFormItemProps" path="intent" label="缩进">
                        <n-input-number v-model:value="model.intent" />
                    </n-form-item>
                </tool-area>
            </n-form>
        </template>
        <template #output>
            <monaco-editor :init="initOutputEditor" :context-menu-actions="[
                MonacoEditorContextMenuAction['editor.action.clipboardCopyAction'],
                MonacoEditorContextMenuAction['editor.action.clipboardCutAction'],
                MonacoEditorContextMenuAction['editor.action.clipboardPasteAction']
            ]" />
        </template>
    </tool-content>
</template>

<script setup lang="tsx">
import xmlFormat from 'xml-formatter';
import type * as monacoType from 'monaco-editor';
export type Model = {
    collapseContent: boolean,
    intent: number,
    content: string,
}

export type Result = {
    content: string,
}
const model = reactive<Model>({
    content: '<hello><world>foo</world><world>bar</world></hello>',
    collapseContent: true,
    intent: 4
})
const copy = useCopy()
const formRef = useTemplateRef("form")
const outputEditor = shallowRef<monacoType.editor.IStandaloneCodeEditor>();
const initOutputEditor: MonacoEditorComponentProps<monacoType.editor.IStandaloneCodeEditor>['init'] = (params) => {
    const { monaco, editorContainer } = params;
    const model = monaco.editor.createModel('', 'xml');
    const editor = monaco.editor.create(editorContainer, {
        model: model,
        readOnly: true,
        minimap: {
            enabled: false,
        },
    });
    outputEditor.value = editor
    const initText = resRequest.data.value?.content || "";
    editor.setValue(initText)
    return editor
}

const resRequest = useCustomRequest<Result | undefined>(async () => {
    let res: Result | undefined = undefined;
    try {
        await formRef.value?.validate();
        const content = xmlFormat(model.content.trim(), {
            collapseContent: model.collapseContent,
            indentation: ' '.repeat(model.intent),
            lineSeparator: '\n',
        })
        res = {
            content
        }
    } catch (error) {
        resRequest.mutate(undefined)
        outputEditor.value?.setValue("")
        throw error
    }
    outputEditor.value?.setValue(res.content || "")
    return res;
}, {
    loadingKeep: 0,
    debounceOptions: {
        leading: false
    }
})
watch(() => model, () => {
    resRequest.run()
}, {
    immediate: true,
    deep: true
})

</script>