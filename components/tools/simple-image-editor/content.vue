<template>
    <tool-content :vertical="{
        enabled: true,
        top: {
            class: '!h-[15%]'
        },
        bottom: {
            class: '!h-[85%]'
        }
    }" :output="{
        area: {
            label: '配置'
        }
    }">
        
        <template #output>
            <tui-image-editor/>
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