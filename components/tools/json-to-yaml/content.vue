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
            disabled: true
        }
    }">
        <template #output>
            <div class="relative size-full flex ">
                <div class="relative h-[100%] w-[50%] mr-[5px]">
                    <tool-area class="h-[100%]" label="JSON" fold-disabled :label-actions="[
                        {
                            name: 'common-copy',
                            onClick: handleCopyInput
                        }
                    ]">
                        <monaco-editor :init="initInputEditor" :context-menu-actions="[
                            MonacoEditorContextMenuAction['editor.action.clipboardCopyAction'],
                            MonacoEditorContextMenuAction['editor.action.clipboardCutAction'],
                            MonacoEditorContextMenuAction['editor.action.clipboardPasteAction']
                        ]" />
                    </tool-area>
                </div>
                <div class="relative h-[100%] w-[50%] ml-[5px]">
                    <tool-area class="h-[100%]" label="YAML" fold-disabled :label-actions="[
                        {
                            name: 'common-copy',
                            onClick: handleCopyOutput
                        }
                    ]">
                        <monaco-editor :init="initOutputEditor" :context-menu-actions="[
                            MonacoEditorContextMenuAction['editor.action.clipboardCopyAction'],
                            MonacoEditorContextMenuAction['editor.action.clipboardCutAction'],
                            MonacoEditorContextMenuAction['editor.action.clipboardPasteAction']
                        ]" />
                    </tool-area>
                </div>
            </div>
        </template>
    </tool-content>
</template>
<script setup lang="ts">
import type * as monacoType from 'monaco-editor';
import { stringify } from 'yaml';
import JSON5 from 'json5';

const copy = useCopy()
const outputEditor = shallowRef<monacoType.editor.IStandaloneCodeEditor>();
const inputEditor = shallowRef<monacoType.editor.IStandaloneCodeEditor>();
const input = ref(`{
    "foo": 1,
    "bar": false,
    "test": {
        "foo": 1,
        "bar": false
    }
}
`);

const initInputEditor: MonacoEditorComponentProps<monacoType.editor.IStandaloneCodeEditor>['init'] = (params) => {
    const { monaco, editorContainer } = params;
    const model = monaco.editor.createModel('', 'json');
    const editor = monaco.editor.create(editorContainer, {
        model: model,
        minimap: {
            enabled: false,
        },
    });
    inputEditor.value = editor
    editor.setValue(input.value)
    editor.onDidChangeModelContent(() => {
        const value = editor?.getValue();
        input.value = value
    });
    return editor
}

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
    const initText = transformer(input.value);
    editor.setValue(initText)
    return editor
}
const handleCopyInput = () => {
    const output = inputEditor.value?.getValue() || "";
    copy(output)
}

const handleCopyOutput = () => {
    const output = outputEditor.value?.getValue() || "";
    copy(output)
}

const transformer = (value: string) => {
    let res = "";
    try {
        res = stringify(JSON5.parse(value));
    } catch (error) {
    }
    return res
}

watch(() => input.value, (inputValue) => {
    const res = transformer(inputValue);
    outputEditor.value?.setValue(res)
}, { immediate: true })

</script>