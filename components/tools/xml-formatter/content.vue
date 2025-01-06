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
                    <common-form-item-input type="common" :custom="{
                        formItem: {
                            label: '原始 XML',
                        },
                        input: {
                            type: 'textarea',
                            rows: 4,
                            value: model.content,
                            onUpdateValue: (val) => { model.content = val }
                        }
                    }" />
                    <common-form-item-switch type="common" :custom="{
                        formItem: {
                            label: '折叠内容',
                        },
                        switch: {
                            value: model.collapseContent,
                            onUpdateValue: (val) => { model.collapseContent = val }
                        }
                    }" />
                    <common-form-item-input-number type="common" :custom="{
                        formItem: {
                            label: '缩进',
                        },
                        inputNumber: {
                            value: model.intent,
                            onUpdateValue: (val) => { model.intent = val ?? 0 }
                        }
                    }" />
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