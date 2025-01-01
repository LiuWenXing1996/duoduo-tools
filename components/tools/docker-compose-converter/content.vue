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
                        'button.onClick': () => { copy(resRequest.data.value?.yaml || '') }
                    }
                },
                {
                    type: 'simple',
                    shortcut: {
                        'icon.name': 'common-download',
                        'button.onClick': handleDownload
                    }
                }
            ]
        }
    }">
        <template #input>
            <n-form ref="form" :model="model">
                <define-tool-area label="配置">
                    <common-form-item-input type="common" :custom="{
                        formItem: {
                            label: '命令',
                        },
                        input: {
                            type: 'textarea',
                            rows: 10,
                            value: model.content,
                            onUpdateValue: (val) => { model.content = val }
                        }
                    }" />
                </define-tool-area>
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
    </define-tool-wrapper>
</template>

<script setup lang="tsx">
import type * as monacoType from 'monaco-editor';
import { MessageType, ComposerizeResult, composerize } from 'composerize-ts';
export type Model = {
    content: string,
}

export type Result = ComposerizeResult | undefined
const model = reactive<Model>({
    content: ""
})
onMounted(() => {
    model.content = `docker run -p 80:80 -v /var/run/docker.sock:/tmp/docker.sock:ro --restart always --log-opt max-size=1g nginx`
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
    const initText = resRequest.data.value?.yaml || "";
    editor.setValue(initText)
    return editor
}
const resRequest = useCustomRequest<Result | undefined>(async () => {
    let res: Result | undefined = undefined;
    try {
        await formRef.value?.validate();
        const result = composerize(model.content)
        res = result
    } catch (error) {
        resRequest.mutate(undefined)
        throw error
    }
    outputEditor.value?.setValue(res.yaml || "")
    return res;
}, {
    loadingKeep: 0,
    debounceOptions: {
        leading: true
    }
})
const notImplemented = computed(() => {
    return resRequest.data.value?.messages.filter(msg => msg.type === MessageType.notImplemented).map(msg => msg.value) || []
});
const notComposable = computed(() => {
    return resRequest.data.value?.messages.filter(msg => msg.type === MessageType.notTranslatable).map(msg => msg.value) || []
});
const errors = computed(() => {
    return resRequest.data.value?.messages
        .filter(msg => msg.type === MessageType.errorDuringConversion)
        .map(msg => msg.value) || []
});
watch(() => model, () => {
    resRequest.run()
}, {
    immediate: true,
    deep: true
})
const handleDownload = async () => {
    if (!resRequest.data.value) {
        return
    };
    const data = resRequest.data.value.yaml || '';
    const base64 = textToBase64(data);
    const dataUrl = base64ToDataURLByFileExtension(base64, "yaml")
    downloadURL(dataUrl, `docker-compose.yml`);
}

</script>