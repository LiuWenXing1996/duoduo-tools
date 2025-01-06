<template>
    <tool-content :output="{
        area: {
            labelActions: [
                {
                    name: 'common-refresh',
                    onClick: handleRefresh,
                }
            ]
        }
    }">
        <template #input>
            <n-form ref="form" :model="model">
                <tool-area label="配置">
                    <n-form-item :="commonFormItemProps" label="数量" path="count" :rule="[
                        {
                            validator: () => {
                                return model.count > 0
                            }, message: '数量必须大于0', trigger: allFormItemTrigger
                        },
                    ]">
                        <n-input-number v-model:value="model.count" min="1" />
                    </n-form-item>
                    <n-form-item :="commonFormItemProps" path="prefix">
                        <template #label>
                            <tool-label label="前缀" :actions="[
                                {
                                    name: 'common-demo',
                                    tooltip: '使用示例',
                                    onClick: () => { addPrefixDemo() }
                                }
                            ]" />
                        </template>
                        <n-input v-model:value="model.prefix" />
                    </n-form-item>
                    <n-form-item :="commonFormItemProps" path="separators" label="分隔符">
                        <n-select v-model:value="model.separators" :options="separatorTypeOptions" />
                    </n-form-item>
                    <n-form-item :="commonFormItemProps" path="case" label="大小写">
                        <n-select v-model:value="model.case" :options="caseTypeOptions" />
                    </n-form-item>
                </tool-area>
            </n-form>
        </template>
        <template #output>
            <common-key-value :item-label-width="30" :data="[
                ...resRequest.data.value?.content.map((item, index) => {
                    return {
                        label: `${index + 1}`,
                        value: item,
                        valueActions: [commonCopyAction(item)]
                    }
                }) ?? []
            ]" />
        </template>
    </tool-content>
</template>

<script setup lang="tsx">
import _ from 'lodash';
import { range } from 'lodash';
export type Model = {
    count: number,
    prefix: string,
    case: 'Uppercase' | 'Lowercase',
    separators: ':' | '-' | '.' | 'none',
}

export type Result = {
    content: string[],
}
const model = reactive<Model>({
    count: 10,
    prefix: '',
    case: 'Uppercase',
    separators: ':',
})
const addPrefixDemo = () => {
    model.prefix = '34:BC:E5'
}
onMounted(() => {
    addPrefixDemo()
})
const copy = useCopy()
const commonCopyAction = (content: string): CommonIconButtonComponentProps | undefined => {
    if (!content) {
        return undefined
    }
    return {
        type: 'simple',
        shortcut: {
            'icon.name': 'common-copy',
            'button.onClick': () => {
                copy(content)
            }
        }
    }
}
const caseTypeOptions = defineSelectOptionList<Record<Model['case'], unknown>>({
    Uppercase: { label: '大写' },
    Lowercase: { label: '小写' },
})
const separatorTypeOptions = defineSelectOptionList<Record<Model['separators'], unknown>>({
    ':': { label: '冒号(:)' },
    '-': { label: '横线(-)' },
    '.': { label: '点(.)' },
    none: { label: '无' },
})
const splitPrefix = (prefix: string): string[] => {
    const base = prefix.match(/[^0-9a-f]/i) === null ? prefix.match(/.{1,2}/g) ?? [] : prefix.split(/[^0-9a-f]/i);

    return base.filter(Boolean).map(byte => byte.padStart(2, '0'));
}
const generateRandomMacAddress = ({ prefix: rawPrefix = '', separator = ':', getRandomByte = () => _.random(0, 255).toString(16).padStart(2, '0') }: { prefix?: string; separator?: string; getRandomByte?: () => string } = {}) => {
    const prefix = splitPrefix(rawPrefix);

    const randomBytes = _.times(6 - prefix.length, getRandomByte);
    const bytes = [...prefix, ...randomBytes];

    return bytes.join(separator);
}
const refreshTag = ref(false);
const handleRefresh = () => {
    refreshTag.value = !refreshTag.value
}
const formRef = useTemplateRef("form")
const resRequest = useCustomRequest<Result | undefined>(async () => {
    let res: Result | undefined = undefined;
    try {
        await formRef.value?.validate();
        const separator = model.separators === 'none' ? undefined : model.separators;
        const content = range(model.count).map(() => generateRandomMacAddress({
            prefix: model.prefix,
            separator: separator,
        })).map(item => {
            if (model.case === 'Uppercase') {
                return item.toUpperCase()
            }
            return item.toLowerCase()
        });
        res = {
            content
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
watch([() => model, () => refreshTag.value], () => {
    resRequest.run()
}, {
    immediate: true,
    deep: true
})

</script>