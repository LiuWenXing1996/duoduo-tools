<template>
    <tool-wrapper :output="{
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
                    <common-form-item-input-number type="common" :custom="{
                        formItem: {
                            label: '数量',
                            path: 'count',
                            rule: [
                                {
                                    validator: () => {
                                        return model.count > 0
                                    }, message: '数量必须大于0', trigger: allFormItemTrigger
                                },
                            ],
                        },
                        inputNumber: {
                            min: 1,
                            value: model.count,
                            onUpdateValue: (val) => { model.count = val ?? 0 }
                        }
                    }" />
                    <common-form-item-input type="common" :custom="{
                        formItem: {
                            label: '前缀',
                            labelActions: [
                                {
                                    type: 'simple',
                                    shortcut: {
                                        'icon.name': 'common-demo',
                                        'button.onClick': () => { addPrefixDemo() },
                                        'tooltipWrapper.content': '点击使用示例',
                                        'tooltipWrapper.enabled': true,
                                    }
                                }
                            ],
                        },
                        input: {
                            value: model.prefix,
                            onUpdateValue: (val) => { model.prefix = val }
                        }
                    }" />
                    <common-form-item-select type="common" :custom="{
                        formItem: {
                            label: '分隔符',
                        },
                        select: {
                            options: separatorTypeOptions,
                            value: model.separators,
                            onUpdateValue: (val) => { model.separators = val }
                        }
                    }" />
                    <common-form-item-select type="common" :custom="{
                        formItem: {
                            label: '大小写',
                        },
                        select: {
                            options: caseTypeOptions,
                            value: model.case,
                            onUpdateValue: (val) => { model.case = val }
                        }
                    }" />
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
    </tool-wrapper>
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