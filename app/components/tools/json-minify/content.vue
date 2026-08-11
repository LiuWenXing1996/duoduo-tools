<template>
    <tool-content :output="{
        area: {
            labelActions: [
                {
                    name: 'common-copy',
                    onClick: () => { copy(resRequest.data.value?.content || '') }
                }
            ]
        }
    }">
        <template #input>
            <n-form ref="form" :model="model">
                <tool-area label="输入">
                    <n-form-item :="commonFormItemProps" path="content">
                        <template #label>
                            <tool-label label="原始 Json" />
                        </template>
                        <n-input type="textarea" :rows="10" clearable v-model:value="model.content" />
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
import JSON5 from 'json5';
export type Model = {
    content: string,
}

export type Result = {
    content: string,
}
const model = reactive<Model>({
    content: ""
})
onMounted(() => {
    model.content = `{
    "foo": "bars",
    "hello": "world"
}`
})
const copy = useCopy()
const transformer = (value: string) => {
    const val = (value ?? "").trim();
    if (!val) {
        return ""
    }
    return JSON.stringify(JSON5.parse(val), null, 0)
}

const formRef = useTemplateRef("form")
const resRequest = useCustomRequest<Result | undefined>(async () => {
    let res: Result | undefined = undefined;
    try {
        await formRef.value?.validate();
        res = {
            content: transformer(model.content)
        }
    } catch (error) {
        resRequest.mutate(undefined)
        throw error
    }
    return res;
}, {
    loadingKeep: 0,
    debounceOptions: {
        leading: false
    }
})
watch(() => model, () => {
    resRequest.run()
}, {
    immediate: true,
    deep: true
})

</script>