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
                            <tool-label label="原始 Html" :actions="[
                                {
                                    name: 'common-demo',
                                    tooltip: '使用示例',
                                    onClick: () => {
                                        model.content = example
                                    }
                                }
                            ]" />
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
import { minify } from 'htmlfy'
export type Model = {
    content: string,
}

export type Result = {
    content: string,
}
const model = reactive<Model>({
    content: ""
})
const example = ` <!DOCTYPE html>
<html>
<head>
<title>Page Title</title>
</head>
<body>

<h1>This is a Heading</h1>
<p>This is a paragraph.</p>

</body>
</html>
`
onMounted(() => {
    model.content = example
})
const copy = useCopy()
const transformer = (value: string) => {
    const val = (value ?? "").trim();
    if (!val) {
        return ""
    }
    return minify(val)
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