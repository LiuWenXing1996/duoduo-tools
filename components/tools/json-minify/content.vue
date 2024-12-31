<template>
    <define-tool-wrapper :output="{
        area: {
            labelActions: [
                {
                    type: 'simple',
                    shortcut: {
                        'icon.name': 'common-copy',
                        'button.onClick': () => { copy(resRequest.data.value?.content || '') }
                    }
                }
            ]
        }
    }">
        <template #input>
            <n-form ref="form" :model="model">
                <define-tool-area label="输入">
                    <common-form-item-input type="common" :custom="{
                        formItem: {
                            label: '原始 Json',
                        },
                        input: {
                            type: 'textarea',
                            rows: 10,
                            value: model.content,
                            onUpdateValue: (val) => { model.content = val }
                        }
                    }" />
                </define-tool-area>
            </n-form>
        </template>
        <template #output>
            {{ resRequest.data.value?.content }}
        </template>
    </define-tool-wrapper>
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