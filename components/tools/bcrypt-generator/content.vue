<template>
    <define-tool-wrapper>
        <template #input>
            <n-form :model="model" require-mark-placement="left">
                <define-tool-area label="配置">
                    <n-form-item path="text" first label="输入">
                        <n-input clearable placeholder="输入文本" v-model:value="model.text" />
                    </n-form-item>
                    <n-form-item path="saltRounds" first label="轮询次数">
                        <n-input-number v-model:value="model.saltRounds" :min="1" />
                    </n-form-item>
                </define-tool-area>
            </n-form>
        </template>
        <template #output>
            <div class=" whitespace-pre-wrap">
                {{ textRes }}
            </div>
        </template>
        <template #actions>
            <n-space>
                <n-button size="small" @click="handleCopy">复制</n-button>
            </n-space>
        </template>
    </define-tool-wrapper>
</template>
<script setup lang="ts">
import copy from 'copy-to-clipboard';
import bcrypt from "bcryptjs";
export type Model = {
    text: string,
    saltRounds: number,
}
const initialText = `123`

const model = reactive<Model>({
    text: initialText,
    saltRounds: 1,
})
const message = useMessage()
const textRes = computed(() => {
    const text = model.text || "";
    const saltRounds = model.saltRounds;
    const result = bcrypt.hashSync(text, saltRounds);
    return result
})
const handleCopy = () => {
    const res = copy(textRes.value || "");
    if (res) {
        message.success("复制成功")
    } else {
        message.error("复制失败")
    }
}
</script>