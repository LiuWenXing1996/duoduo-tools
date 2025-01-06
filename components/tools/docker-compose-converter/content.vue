<template>
    <tool-content :output="{
        scroll: {
            disabled: true
        },
        area: {
            labelActions: [
                {
                    name: 'common-copy',
                    onClick: () => { copy(result?.data?.yaml || '') }
                },
                {
                    name: 'common-download',
                    onClick: handleDownload
                }
            ]
        }
    }">
        <template #input>
            <n-form ref="form" :model="model">
                <tool-area label="配置">
                    <n-form-item :="commonFormItemProps">
                        <template #label>
                            <tool-label label="命令" :actions="[
                                {
                                    name: 'common-demo',
                                    tooltip: '使用示例',
                                    onClick: addExample
                                },
                            ]" />
                        </template>
                        <n-input type="textarea" :rows="10" v-model:value="model.content" />
                    </n-form-item>
                </tool-area>
            </n-form>
        </template>
        <template #output>
            <div class="size-full flex flex-col">
                <div v-if="notComposable.length > 0" class="mb-[10px]">
                    <n-alert title="这些选项无法转换为 docker-compose" type="info">
                        <ul>
                            <li v-for="(message, index) of notComposable" :key="index">
                                {{ message }}
                            </li>
                        </ul>
                    </n-alert>
                </div>
                <div v-if="notImplemented.length > 0" class="mb-[10px]">
                    <n-alert title="这些选项尚未实现，因此尚未转换为 docker-compose" type="warning">
                        <ul>
                            <li v-for="(message, index) of notImplemented" :key="index">
                                {{ message }}
                            </li>
                        </ul>
                    </n-alert>
                </div>
                <div v-if="errors.length > 0" class="mb-[10px]">
                    <n-alert title="发生以下错误" type="error">
                        <ul>
                            <li v-for="(message, index) of errors" :key="index">
                                {{ message }}
                            </li>
                        </ul>
                    </n-alert>
                </div>
                <div class="grow">
                    <monaco-editor :init="initOutputEditor" :context-menu-actions="[
                        MonacoEditorContextMenuAction['editor.action.clipboardCopyAction'],
                        MonacoEditorContextMenuAction['editor.action.clipboardCutAction'],
                        MonacoEditorContextMenuAction['editor.action.clipboardPasteAction']
                    ]" />
                </div>
            </div>
        </template>
    </tool-content>
</template>

<script setup lang="tsx">
import type * as monacoType from 'monaco-editor';
import { MessageType, ComposerizeResult, composerize } from 'composerize-ts';
export type Model = {
    content: string,
}

export type Result = {
    data: ComposerizeResult | undefined
}
const model = reactive<Model>({
    content: ""
})
const example = `docker run -p 80:80 -v /var/run/docker.sock:/tmp/docker.sock:ro --restart always --log-opt max-size=1g nginx`
onMounted(() => {
    model.content = example
})
const addExample = () => {
    model.content = example
}
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
    const initText = result.value?.data?.yaml || ""
    editor.setValue(initText)
    return editor
}
const messages = useAnyMessage();
const result = computedAsync(async () => {
    let res: Result | undefined = undefined;
    try {
        const composerizeResult = composerize(model.content)
        await formRef.value?.validate();
        res = {
            data: composerizeResult
        }
    } catch (error) {
        messages.anyError(error)
        res = undefined
    }
    outputEditor.value?.setValue(res?.data?.yaml || "")
    return res;
})

const notImplemented = computed(() => {
    return result.value?.data?.messages.filter(msg => msg.type === MessageType.notImplemented).map(msg => msg.value) || []
});
const notComposable = computed(() => {
    return result.value?.data?.messages.filter(msg => msg.type === MessageType.notTranslatable).map(msg => msg.value) || []
});
const errors = computed(() => {
    return result.value?.data?.messages
        .filter(msg => msg.type === MessageType.errorDuringConversion)
        .map(msg => msg.value) || []
});

const handleDownload = async () => {
    if (!result.value?.data) {
        return
    };
    const data = result.value?.data.yaml || '';
    const base64 = textToBase64(data);
    const dataUrl = base64ToDataURLByFileExtension(base64, "yaml")
    downloadURL(dataUrl, `docker-compose.yml`);
}

</script>