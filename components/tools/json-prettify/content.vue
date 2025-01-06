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
                            <tool-label label="原始 Json" />
                        </template>
                        <n-input type="textarea" :rows="4" clearable v-model:value="model.content" />
                    </n-form-item>
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
import JSON5 from 'json5';
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
    content: '{"hello": "world", "foo": "bar"}',
    isSort: true,
    intent: 4
})
const copy = useCopy()
const formRef = useTemplateRef("form")
const outputEditor = shallowRef<monacoType.editor.IStandaloneCodeEditor>();
const initOutputEditor: MonacoEditorComponentProps<monacoType.editor.IStandaloneCodeEditor>['init'] = (params) => {
    const { monaco, editorContainer } = params;
    const model = monaco.editor.createModel('', 'json');
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
const sortObjectKeys = <T,>(obj: T): T => {
    if (typeof obj !== 'object' || obj === null) {
        return obj;
    }

    if (Array.isArray(obj)) {
        return obj.map(sortObjectKeys) as unknown as T;
    }

    return Object.keys(obj)
        .sort((a, b) => a.localeCompare(b))
        .reduce((sortedObj, key) => {
            sortedObj[key] = sortObjectKeys((obj as Record<string, unknown>)[key]);
            return sortedObj;
        }, {} as Record<string, unknown>) as T;
}

const formatJson = ({
    rawJson,
    sortKeys = true,
    indentSize = 3,
}: {
    rawJson: string
    sortKeys?: boolean
    indentSize?: number
}) => {
    if (!rawJson) {
        return ""
    }
    const parsedObject = JSON5.parse(rawJson || "");
    return JSON.stringify(sortKeys ? sortObjectKeys(parsedObject) : parsedObject, null, indentSize);
}
const resRequest = useCustomRequest<Result | undefined>(async () => {
    let res: Result | undefined = undefined;
    try {
        await formRef.value?.validate();
        res = {
            content: formatJson({
                rawJson: model.content,
                sortKeys: model.isSort,
                indentSize: model.intent
            })
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