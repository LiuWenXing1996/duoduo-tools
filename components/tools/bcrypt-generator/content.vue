<template>
    <tool-wrapper :output="{
        area: {
            labelActions: [
                {
                    name: 'common-copy',
                    onClick: () => copy(result?.content || ''),
                }
            ]
        }
    }">
        <template #input>
            <n-form :model="model" require-mark-placement="left">
                <tool-area label="配置">
                    <n-form-item :="commonFormItemProps" path="text">
                        <template #label>
                            <tool-label label="输入" :actions="[
                                {
                                    name: 'common-demo',
                                    tooltip: '使用示例',
                                    onClick: addExample,
                                }
                            ]" />
                        </template>
                        <n-input type="textarea" clearable placeholder="输入文本" v-model:value="model.text" />
                    </n-form-item>
                    <n-form-item :="commonFormItemProps" path="saltRounds" first label="轮询次数">
                        <n-input-number v-model:value="model.saltRounds" :min="1" />
                    </n-form-item>
                </tool-area>
            </n-form>
        </template>
        <template #output>
            <common-rich-text :content="result?.content" />
        </template>
    </tool-wrapper>
</template>
<script setup lang="ts">
import bcrypt from "bcryptjs";
export type Model = {
    text: string,
    saltRounds: number,
}
export type Result = {
    content: string
}

const model = reactive<Model>({
    text: "",
    saltRounds: 1,
})
const copy = useCopy()

const addExample = () => {
    const initialText = `我是一个示例文本 123`;
    model.text = initialText;
}
onMounted(() => {
    addExample()
})
const result = computed(() => {
    let res: undefined | Result = undefined;
    const text = model.text || "";
    const saltRounds = model.saltRounds;
    const hashRes = bcrypt.hashSync(text, saltRounds);
    res = {
        content: hashRes,
    }
    return res
})
</script>