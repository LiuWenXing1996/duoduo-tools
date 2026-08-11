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
                            <tool-label label="原始 CSS" :actions="[
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
import { minify } from 'csso';
export type Model = {
    content: string,
}

export type Result = {
    content: string,
}
const model = reactive<Model>({
    content: ""
})
const example = `body {
  background-color: lightblue;
}

h1 {
  color: white;
  text-align: center;
}

p {
  font-family: verdana;
  font-size: 20px;
}
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
    const minifiedCss = minify(val).css;
    return minifiedCss
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