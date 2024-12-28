<template>
    <define-tool-wrapper>
        <template #input>
            <n-form ref="form" :model="model">
                <define-tool-area label="配置">
                    <n-form-item :="formItemPropsMap.content">
                        <n-input v-model:value="model.content" :min="0" />
                    </n-form-item>
                </define-tool-area>
            </n-form>
        </template>
        <template #output>
            {{ resRequest.data.value?.content }}
        </template>
    </define-tool-wrapper>
</template>

<script setup lang="tsx">

export type Model = {
    content: string,
}

export type Result = {
    content: string,
}
const model = reactive<Model>({
    content: ""
})

const formRef = useTemplateRef("form")
const formItemPropsMap = defineFromItemPropsMap(
    {
        "content": {
            config: {
                label: "内容",
            }
        },
    },
    {
        first: true
    }
)
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