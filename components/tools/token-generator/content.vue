<template>
    <tool-content>
        <template #input>
            <n-form :model="model" require-mark-placement="left">
                <tool-area label="配置">
                    <n-form-item path="withUppercase" first label="大写字母">
                        <n-switch v-model:value="model.withUppercase" />
                    </n-form-item>
                    <n-form-item path="withLowercase" first label="小写字母">
                        <n-switch v-model:value="model.withLowercase" />
                    </n-form-item>
                    <n-form-item path="withNumbers" first label="数字">
                        <n-switch v-model:value="model.withNumbers" />
                    </n-form-item>
                    <n-form-item path="withSymbols" first label="符号">
                        <n-switch v-model:value="model.withSymbols" />
                    </n-form-item>
                    <n-form-item path="length" first label="长度">
                        <n-input-number v-model:value="model.length" :min="1" :step="8" />
                    </n-form-item>
                </tool-area>
            </n-form>
        </template>
        <template #output>
            <div class="break-all">
                {{ textRes }}
            </div>
        </template>
        <template #actions>
            <n-space>
                <n-button size="small" @click="copy(textRes)">复制</n-button>
                <n-button size="small" @click="handleRefresh">重新生成</n-button>
            </n-space>
        </template>
    </tool-content>
</template>
<script setup lang="ts">
import { shuffle } from 'radash';
const model = reactive<{
    length: number,
    withUppercase: boolean,
    withLowercase: boolean,
    withNumbers: boolean,
    // TODO:支持挑选某些特殊字符
    withSymbols: boolean,
}>({
    length: 64,
    withUppercase: true,
    withLowercase: true,
    withNumbers: true,
    withSymbols: true,
})
const refreshTag = ref(false);
const handleRefresh = () => {
    refreshTag.value = !refreshTag.value
}
const copy = useCopy()
const textRes = computed(() => {
    const refreshEmptyStr = refreshTag.value ? "" : ""
    const allAlphabet = [
        model.withUppercase ? 'ABCDEFGHIJKLMOPQRSTUVWXYZ' : '',
        model.withLowercase ? 'abcdefghijklmopqrstuvwxyz' : '',
        model.withNumbers ? '0123456789' : '',
        model.withSymbols ? '.,;:!?./-"\'#{([-|\\@)]=}*+' : '',
    ].join('');
    const length = model.length
    const result = shuffle(allAlphabet.repeat(length).split("")).join("").substring(0, length)
    return result + refreshEmptyStr
})
</script>