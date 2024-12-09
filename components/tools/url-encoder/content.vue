<template>
    <define-tool-wrapper>
        <template #input>
            <n-form :model="model">
                <define-tool-area label="文本">
                    <n-form-item path="text" first>
                        <template #label>
                            <div class="inline-flex">
                                <span>
                                    输入
                                </span>
                            </div>
                        </template>
                        <n-input clearable type="textarea" :rows="3" placeholder="输入文本" v-model:value="model.text" />
                    </n-form-item>
                </define-tool-area>
            </n-form>
        </template>
        <template #output>
            <div class="break-all">{{ textRes }}</div>
        </template>
        <template #actions>
            <n-space>
                <n-button size="small" @click="copy(textRes)">复制</n-button>
            </n-space>
        </template>
    </define-tool-wrapper>
</template>
<script setup lang="ts">
export type Model = {
    text: string,
}

const initialText = 'Hello world :)'
const copy = useCopy();

const model = reactive<Model>({
    text: initialText,
})

const textRes = computed(() => {
    const text = model.text || "";
    const res = encodeURIComponent(text)
    return res
})
</script>