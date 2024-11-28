<template>
    <n-form ref="formRef" :model="model" :rules="rules" require-mark-placement="left">
        <n-form-item path="img" first label="图片">
            <n-upload v-model:file-list="iconFileList" list-type="image-card" :max="1" />
        </n-form-item>
        <n-form-item path="size" first label="大小">
            <n-input-number v-model:value="model.size" :min="0" :max="100" :step="5">
                <template #suffix>
                    %
                </template>
            </n-input-number>
        </n-form-item>
        <n-form-item path="margin" first label="边距">
            <n-input-number v-model:value="model.margin" :min="0" :step="5">
                <template #suffix>
                    像素
                </template>
            </n-input-number>
        </n-form-item>
        <n-form-item path="hideBackgroundDots" first label="隐藏背后的信息点">
            <n-switch v-model:value="model.hideBackgroundDots" />
        </n-form-item>
    </n-form>
</template>
<script lang="ts">
export type Model = {
    image: string
    hideBackgroundDots: boolean;
    size: number;
    margin: number;
}

</script>
<script setup lang="ts">
import type { FormInst, FormRules, UploadFileInfo } from 'naive-ui';

const formRef = ref<FormInst | null>(null)
const model = reactive<Model>({
    image: "",
    hideBackgroundDots: true,
    size: 40,
    margin: 0
})
const rules: FormRules = {}
const iconFileList = ref<UploadFileInfo[]>([])
watch(iconFileList, async () => {
    const file = iconFileList.value[0]?.file
    let text = ""
    if (file) {
        text = await toBase64(file) || ""
    }
    model.image = text
}, { immediate: true })

const toBase64 = (file: File) => new Promise<string | null>((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string | null);
    reader.onerror = reject;
});

defineExpose({
    formRef,
    model
})
</script>
