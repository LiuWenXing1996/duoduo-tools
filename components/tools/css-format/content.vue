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
                    <n-form-item :="commonFormItemProps" path="content">
                        <template #label>
                            <tool-label label="原始 CSS" :actions="[
                                {
                                    name: 'common-demo',
                                    tooltip: '使用示例',
                                    onClick: () => {
                                        model.content = example
                                    }
                                }
                            ]" />
                        </template>
                        <n-input type="textarea" :rows="10" clearable v-model:value="model.content" />
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
import type * as monacoType from 'monaco-editor';
import * as prettier from "prettier";
import postcssPlugin from "prettier/plugins/postcss"
export type Model = {
    content: string,
}

export type Result = {
    content: string,
}
const example = `body{background-color:#add8e6}h1{color:#fff;text-align:center}p{font-family:verdana;font-size:20px}`
const model = reactive<Model>({
    content: example,
})
const copy = useCopy()
const formRef = useTemplateRef("form")
const outputEditor = shallowRef<monacoType.editor.IStandaloneCodeEditor>();
const initOutputEditor: MonacoEditorComponentProps<monacoType.editor.IStandaloneCodeEditor>['init'] = (params) => {
    const { monaco, editorContainer } = params;
    const model = monaco.editor.createModel('', 'css');
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
        const content = model.content;
        const formatContent = await prettier.format(content, {
            parser: 'css',
            plugins: [postcssPlugin]
        })
        res = {
            content: formatContent
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