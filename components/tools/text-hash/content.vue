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
                        <n-input clearable placeholder="输入单词" v-model:value="model.text" />
                    </n-form-item>
                </define-tool-area>
            </n-form>
        </template>
        <template #output>
            <n-descriptions label-placement="left" :column="1" label-class="w-[100px] inline-flex"
                content-class="w-[calc(100%-100px)]">
                <n-descriptions-item v-for="text in textRes">
                    <template #label>
                        <div class="inline-flex">
                            <span class="font-medium">
                                {{ text.name }}
                            </span>
                        </div>
                    </template>
                    <div class="inline-flex" v-if="text.result">
                        <span class=" break-all">
                            {{ text.result }}
                            <n-tooltip trigger="hover">
                                <template #trigger>
                                    <div class=" inline-flex">
                                        <svg-icon class="ml-[2px] pb-[5px] text-[12px] cursor-pointer"
                                            name="common-copy" @click="copy(text.result)" />
                                    </div>
                                </template>
                                {{ `点击复制` }}
                            </n-tooltip>
                        </span>

                    </div>
                </n-descriptions-item>
            </n-descriptions>
        </template>
    </define-tool-wrapper>
</template>
<script setup lang="ts">
import { methods } from './utils';

const initialText = '123456'
const copy = useCopy()
const model = reactive({
    text: initialText
})
const textRes = computed(() => {
    const text = model.text || "";
    return methods.map(m => {
        return {
            ...m,
            result: m.run(text)
        }
    })
})
</script>