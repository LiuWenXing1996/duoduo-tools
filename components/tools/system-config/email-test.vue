<template>
    <n-spin size="small" :show="sendRequest.loading.value">
        <n-form ref="formRef" :model="model" :rules="rules" label-placement="left" label-width="100px"
            require-mark-placement="left">
            <n-form-item path="to" first label="目标邮箱">
                <n-input v-model:value="model.to" placeholder="请输入目标邮箱" />
            </n-form-item>
            <n-form-item path="subject" first label="主题">
                <n-input v-model:value="model.subject" placeholder="请输入主题" />
            </n-form-item>
            <n-form-item path="content" first label="内容">
                <n-input type="textarea" v-model:value="model.content" placeholder="请输入内容，支持 html 标签" />
            </n-form-item>
            <n-form-item label=" " :show-feedback="false" first>
                <div class=" flex flex-col	">
                    <n-space>
                        <n-button :loading="sendRequest.loading.value" @click="sendRequest.runAsync()">
                            发送
                        </n-button>
                    </n-space>
                </div>
            </n-form-item>
        </n-form>
    </n-spin>
</template>
<script setup lang="ts">
export type Model = EmailSendOptions['data']
export type Props = {
    config: EmailSendOptions["config"]
}
import type { FormRules } from 'naive-ui';
import { type EmailSendOptions } from "~/schema/email"

const props = defineProps<Props>()

const form = useTemplateRef("formRef")
const model = reactive<Model>({
    to: '',
    subject: '',
    content: '',
})
const rules = reactive<FormRules>({
    to: [
        { required: true, message: '请输入邮箱地址', trigger: ["change", 'blur'] },
        { type: "email", message: '请输入格式正确的邮箱', trigger: ["change", 'blur'] }
    ],
    subject: [
        { required: true, message: '请输入主题', trigger: ["change", 'blur'] },
    ],
    content: [
        { required: true, message: '请输入内容', trigger: ["change", 'blur'] },
    ],
})
const message = useMessage();
const sendRequest = useCustomRequest(async () => {
    const isValid = await form.value?.validate();
    if (!isValid) {
        return
    }
    const params: EmailTestPostApiParams = {
        config: props.config,
        data: model
    }
    const res = await $fetch("/api/email/test", {
        method: "POST",
        body: params
    })
    if (res) {
        message.success("发送成功")
    }
})

defineExpose({
    form,
    model
})
</script>
