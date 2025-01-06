<template>
    <tool-wrapper :output="{
        area: {
            labelActions: [
                {
                    name: 'common-copy',
                    onClick: () => {
                        copy(result?.content)
                    }
                }
            ]
        }
    }">
        <template #input>
            <n-form ref="form" :model="model">
                <tool-area label="配置">
                    <n-form-item :="commonFormItemProps" path="content" :rule="[
                        {
                            required: true,
                            message: '请输入Json'
                        }
                    ]">
                        <template #label>
                            <common-form-item-label label="Json" :actions="[
                                {
                                    type: 'common',
                                    shortcut: {
                                        'icon.name': 'common-demo',
                                        'button.onClick': () => {
                                            model.content = example
                                        },
                                        'tooltipWrapper.content': '使用测试数据',
                                        'tooltipWrapper.enabled': true
                                    }
                                }
                            ]" />
                        </template>
                        <n-input v-model:value="model.content" type="textarea" rows="4" />
                    </n-form-item>
                    <n-form-item :bind="commonFormItemProps" label="转义/去转义">
                        <n-switch v-model:value="model.isEscape">
                            <template #checked>转义</template>
                            <template #unchecked>去转义</template>
                        </n-switch>
                    </n-form-item>
                </tool-area>
            </n-form>
        </template>
        <template #output>
            <common-rich-text :content="result?.content" />
        </template>s
    </tool-wrapper>
</template>

<script setup lang="tsx">

export type Model = {
    content: string,
    isEscape: boolean,
}

export type Result = {
    content: string,
}
const model = reactive<Model>({
    content: "",
    isEscape: true,
})

onMounted(() => {
    model.content = example
})

const copy = useCopy()

const example = `{
    "foo": "bar",
    "hello": "world"
}`

const escape = (val: string) => {
    if (!val) {
        return ""
    }
    const reg = "\""
    let pattern = new RegExp("[" + reg + "]");
    let res = '';
    Array.from(val).forEach((char: any) => {
        res += char.replace(pattern, `\\${char}`);
    });
    return res;
}

const unEscape = (val: string) => {
    if (!val) {
        return ""
    }
    return val.replace(/[\\]/g, ``)
}
const formRef = useTemplateRef("form")
const result = computedAsync(async () => {
    let res: Result | undefined = undefined;
    let content = model.content;
    let isEscape = model.isEscape;
    try {
        await formRef.value?.validate();
        if (isEscape) {
            content = escape(content)
        } else {
            content = unEscape(content)
        }
        res = {
            content: content
        }
    } catch (error) {
        res = undefined
    }
    return res;
})
</script>