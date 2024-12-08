<template>
    <define-tool-wrapper>
        <template #input>
            <n-form :model="model" require-mark-placement="left">
                <define-tool-area label="配置">
                    <n-form-item path="text" first label="输入">
                        <n-input clearable placeholder="输入文本" v-model:value="model.text" />
                    </n-form-item>
                    <n-form-item path="hash" first label="加密后的文本">
                        <n-input clearable placeholder="输入加密后的文本" v-model:value="model.hash" />
                    </n-form-item>
                </define-tool-area>
            </n-form>
        </template>
        <template #output>
            <div class=" whitespace-pre-wrap">
                {{ textRes }}
            </div>
        </template>
    </define-tool-wrapper>
</template>
<script setup lang="ts">
import bcrypt from "bcryptjs";
export type Model = {
    text: string,
    hash: string,
}
const initialText = `123`

const model = reactive<Model>({
    text: initialText,
    hash: "$2a$04$aXJxHZ2mL.g.Os.76CfXOOpgF7Vp3ZYrZuJCKahaQTXaBRgtEAUGu",
})
const textRes = computed(() => {
    const text = model.text || "";
    const hash = model.hash || "";
    const result = bcrypt.compareSync(text, hash);
    if (result) {
        return "相同"
    } else {
        return "不同"
    }
})

</script>