<template>
    <tool-content>
        <template #input>
            <n-form ref="form" :model="model">
                <tool-area label="配置">
                    <n-form-item :="commonFormItemProps" path="content">
                        <template #label>
                            <tool-label label="内容" :actions="[
                                {
                                    name: 'common-demo',
                                    tooltip: '使用示例',
                                    onClick: () => {
                                        addExample()
                                    }
                                }
                            ]" />
                        </template>
                        <n-input clearable v-model:value="model.content" />
                    </n-form-item>
                </tool-area>
            </n-form>
        </template>
        <template #output>
            {{ resRequest.data.value?.content }}
        </template>
    </tool-content>
</template>

<script setup lang="tsx">

export type Model = {
    content: string,
}

export type Result = {
    content: string,
}
const exampleText = "我是一个测试文本"
const model = reactive<Model>({
    content: exampleText
})
const addExample = () => {
    model.content = exampleText
}
const formRef = useTemplateRef("form")
const resRequest = useCustomRequest<Result | undefined>(async () => {
    let res: Result | undefined = undefined;
    try {
        await formRef.value?.validate();
        res = {
            content: model.content
        }
    } catch (error) {
        resRequest.mutate(undefined)
        throw error
    }
    return res;
}, {
    loadingKeep: 0,
    debounceOptions: {
        leading: true
    }
})
watch(() => model, () => {
    resRequest.run()
}, {
    immediate: true,
    deep: true
})

</script>