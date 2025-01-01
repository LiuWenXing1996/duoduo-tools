<template>
    <define-tool-wrapper :output="{
        scroll: {
            disabled: true
        },
        area: {
            labelActions: [
                {
                    type: 'simple',
                    shortcut: {
                        'icon.name': 'common-copy',
                        'button.onClick': () => { copy(resRequest.data.value?.content || '') }
                    }
                }
            ]
        }
    }">
        <template #input>
            <n-form ref="form" :model="model">
                <define-tool-area label="输入">
                    <common-form-item-input type="common" :custom="{
                        formItem: {
                            label: '原始 Yaml',
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
                            label: '是否排序',
                        },
                        switch: {
                            value: model.isSort,
                            onUpdateValue: (val) => { model.isSort = val }
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
                </define-tool-area>
            </n-form>
        </template>
        <template #output>
            <monaco-editor :init="initOutputEditor" :context-menu-actions="[
                MonacoEditorContextMenuAction['editor.action.clipboardCopyAction'],
                MonacoEditorContextMenuAction['editor.action.clipboardCutAction'],
                MonacoEditorContextMenuAction['editor.action.clipboardPasteAction']
            ]" />
        </template>
    </define-tool-wrapper>
</template>

<script setup lang="tsx">
import yaml from 'yaml';
import type * as monacoType from 'monaco-editor';
export type Model = {
    isSort: boolean,
    intent: number,
    content: string,
}

export type Result = {
    content: string,
}
const model = reactive<Model>({
    content: '',
    isSort: true,
    intent: 4
})
onMounted(() => {
    model.content = `foo: 1
bar: false
test:
  foo: 1
  bar: false`
})
const copy = useCopy()
const formRef = useTemplateRef("form")
const outputEditor = shallowRef<monacoType.editor.IStandaloneCodeEditor>();
const initOutputEditor: MonacoEditorComponentProps<monacoType.editor.IStandaloneCodeEditor>['init'] = (params) => {
    const { monaco, editorContainer } = params;
    const model = monaco.editor.createModel('', 'yaml');
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
const formatYaml = ({
    rawYaml,
    sortKeys = false,
    indentSize = 2,
}: {
    rawYaml: string
    sortKeys?: boolean
    indentSize?: number
}) => {
    const parsedYaml = yaml.parse((rawYaml || "").trim());

    const formattedYAML = yaml.stringify(parsedYaml, {
        sortMapEntries: sortKeys,
        indent: indentSize
    });

    return formattedYAML;
}

const resRequest = useCustomRequest<Result | undefined>(async () => {
    let res: Result | undefined = undefined;
    try {
        await formRef.value?.validate();
        res = {
            content: formatYaml({
                rawYaml: model.content,
                sortKeys: model.isSort,
                indentSize: model.intent
            })
        }
    } catch (error) {
        outputEditor.value?.setValue("")
        resRequest.mutate(undefined)
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