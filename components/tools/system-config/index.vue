<template>
    <define-tool-wrapper :vertical="{
        enabled: true,
        top: {
            class: '!h-[15%]'
        },
        bottom: {
            class: '!h-[85%]'
        }
    }" :output="{
        scroll: {
            disabled: true
        },
        area: {
            label: '配置'
        }
    }">
        <template #output>
            <div class="relative size-full ">
                <div class="absolute top-0 bottom-0 left-0 right-0">
                    <n-spin
                        :show="updateRequest.loading.value || detailRequest.loading.value || monacoLoader.loading.value"
                        size="small" class="size-full" content-class="size-full">
                        <div ref="editorContainer" class="size-full"></div>
                    </n-spin>
                </div>
            </div>
        </template>
        <template #actions>
            <n-space>
                <n-button size="small" :disabled="detailRequest.loading.value" :loading="updateRequest.loading.value"
                    @click="updateRequest.runAsync">保存</n-button>
                <n-button size="small" :disabled="detailRequest.loading.value || updateRequest.loading.value"
                    @click="handleCheckConfig">校验配置</n-button>
                <n-button size="small" :disabled="detailRequest.loading.value || updateRequest.loading.value"
                    @click="showEmailTestDialog">邮箱测试</n-button>
            </n-space>
        </template>
    </define-tool-wrapper>
</template>
<script setup lang="ts">
import type * as monacoType from 'monaco-editor';
import type { DeepPartial } from 'ts-essentials';
import { SystemConfigSchema, type SystemConfig } from '~/schema/system';
import { zodToJsonSchema } from "zod-to-json-schema";
import { ToolsSystemConfigEmailTest } from '#components';

defineOptions({
    toolMeta: defineToolMeta({
        title: '系统配置',
        description: "系统配置，仅超管可见",
        category: ToolCategory.admin,
        auth: ToolMetaAuth.super
    })
})
const monacoLoader = useMonacoLoader();
monacoLoader.get()

const editorContainerRef = useTemplateRef("editorContainer");
const editor = shallowRef<monacoType.editor.IStandaloneCodeEditor | null>(null)
// let editor: monacoType.editor.IStandaloneCodeEditor | null = null;


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



const SystemConfigJsonSchema = zodToJsonSchema(SystemConfigSchema)


watch([
    () => monacoLoader.lib.value,
    () => editorContainerRef.value
], ([monaco, editorContainer]) => {
    if (editor.value) {
        return
    }
    if (monaco && editorContainer) {
        monaco.languages.json.jsonDefaults.setDiagnosticsOptions({
            schemas: [{
                fileMatch: ['foo.json'],
                uri: "ssss",
                schema: SystemConfigJsonSchema
            }]
        });


        const jsonCode = detailRequest.data.value ? JSON.stringify(detailRequest.data.value, null, 2) : "";

        const model = monaco.editor.createModel(jsonCode, 'json', monaco.Uri.parse("internal://server/foo.json"));

        editor.value = monaco.editor.create(editorContainer, {
            model: model,
            minimap: {
                enabled: false,
            },
        });
        keepSomeActions(editor.value)
    }
}, {
    immediate: true,
    flush: "post"
})

const detailRequest = useCustomRequest(async () => {
    const res = await $fetch("/api/system/config/detail");
    editor.value?.setValue(JSON.stringify(res, null, 2))
    return res
})

const updateRequest = useCustomRequest(async () => {
    const config = getCurrentConfig();
    const configChecked = checkConfig(config)
    if (!configChecked) {
        message.error("校验不通过，请检查配置");
        return
    }

    const params: SystemConfigUpdatePostApiParams = configChecked;

    const res = await $fetch("/api/system/config/update", {
        method: "POST",
        body: params,
    });
    await detailRequest.runAsync()
    message.success("保存成功")
    return res
})



const message = useMessage();
const dialog = useDialog();
const getCurrentConfig = () => {
    const configString = editor.value?.getValue();
    const config = jsonParseSafely<DeepPartial<SystemConfig>>(configString);
    return config
}
const handleCheckConfig = () => {
    const config = getCurrentConfig();
    const res = checkConfig(config)
    if (res) {
        message.success("校验通过");
    } else {
        message.error("校验不通过，请检查配置");
    }
}
const checkConfig = (config: DeepPartial<SystemConfig> | undefined) => {
    try {
        return SystemConfigSchema.parse(config);
    } catch (error) {
        return undefined
    }
}
const showEmailTestDialog = () => {
    const config = getCurrentConfig();
    const configChecked = checkConfig(config)
    if (!configChecked) {
        message.error("校验不通过，请检查配置");
        return
    }
    if (!configChecked.email) {
        message.error("没有配置邮箱服务，请配置 email 字段");
        return
    }
    if (!configChecked.email.enable) {
        message.error("没有开启邮箱服务，请配置 email.enable 字段 为 true");
        return
    }
    const emailConfig = configChecked.email

    dialog.create({
        showIcon: false,
        style: {
            // width: "200px",
        },
        title: "邮箱测试",
        content: () => {
            return h(ToolsSystemConfigEmailTest, {
                config: {
                    ...emailConfig
                }
            });
        },
    });
}

onMounted(() => {
    detailRequest.runAsync()
})

useResizeObserver(editorContainerRef, async (entries) => {
    const entry = entries[0]
    const { width, height } = entry.contentRect;
    editor.value?.layout({
        width, height
    });
});
</script>