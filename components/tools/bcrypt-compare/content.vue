<template>
    <tool-content>
        <template #input>
            <n-form :model="model" require-mark-placement="left">
                <tool-area label="配置" :label-actions="[
                    {
                        name: 'common-demo',
                        tooltip: '使用示例',
                        onClick: addExample,
                    }
                ]">
                    <n-form-item :="commonFormItemProps" path="text" label="输入">
                        <n-input type="textarea" clearable placeholder="输入文本" v-model:value="model.text" />
                    </n-form-item>
                    <n-form-item :="commonFormItemProps" path="hash" label="加密后的文本">
                        <n-input type="textarea" clearable placeholder="输入加密后的文本" v-model:value="model.hash" />
                    </n-form-item>
                </tool-area>
            </n-form>
        </template>
        <template #output>
            <rich-text :content="result.content" />
        </template>
    </tool-content>
</template>
<script setup lang="ts">
import bcrypt from "bcryptjs";
export type Model = {
    text: string,
    hash: string,
}

export type Result = {
    content: string
}

const model = reactive<Model>({
    text: "",
    hash: "",
})

const addExample = () => {
    const initialText = `我是一个示例文本 123`;
    const hash = bcrypt.hashSync(initialText, 4);
    model.text = initialText;
    model.hash = hash;
}
onMounted(() => {
    addExample()
})
const result = computed(() => {
    let res: undefined | Result = undefined;
    const text = model.text || "";
    const hash = model.hash || "";
    const compareRes = bcrypt.compareSync(text, hash);
    if (compareRes) {
        res = {
            content: "相同"
        }
    } else {
        res = {
            content: "不同"
        }
    }
    return res
})

</script>