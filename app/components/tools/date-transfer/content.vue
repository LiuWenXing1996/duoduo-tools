<template>
    <tool-content>
        <template #input>
            <n-form ref="formRef" :model="model">
                <tool-area label="输入">
                    <n-form-item :="commonFormItemProps" path="dateType" label="日期类型">
                        <n-select :options="dataTypeOptions" v-model:value="model.dateType" />
                    </n-form-item>
                    <n-form-item :="commonFormItemProps" path="text" :rule="[
                        { required: true, message: '请输入日期', trigger: allFormItemTrigger },
                        {
                            validator: (rule, value) => {
                                let res = false;
                                try {
                                    res = dateTransferMap[model.dateType].validate(value)
                                } catch (error) {
                                    res = false
                                }
                                return res
                            }, message: '无效的日期类型', trigger: allFormItemTrigger
                        }
                    ]">
                        <template #label>
                            <tool-label label="日期" :actions="[
                                {
                                    name: 'common-demo',
                                    tooltip: '使用示例',
                                    onClick: addTextExample
                                }
                            ]" />
                        </template>
                        <n-input clearable placeholder="输入日期" v-model:value="model.text" />
                    </n-form-item>
                </tool-area>
            </n-form>
        </template>
        <template #output>
            <key-value :data="[
                ...((result?.list || []).map(item => {
                    return {
                        label: item.label,
                        value: item.result,
                        valueActions: [
                            {
                                name: 'common-copy',
                                onClick: () => {
                                    copy(item.result)
                                }
                            }
                        ]
                    }
                }))
            ]" />
        </template>
    </tool-content>
</template>
<script setup lang="ts">
import type { SelectOption } from 'naive-ui';
import { type DateType, dateTransferMap } from '~/utils/date';

export type Model = {
    dateType: DateType,
    text: string
}

export type Result = {
    list: {
        label: string,
        result: string
    }[]
}

const copy = useCopy()
const model = reactive<Model>({
    dateType: 'ISO-8601',
    text: ""
})
const form = useTemplateRef("formRef")
onMounted(() => {
    const now = new Date()
    model.text = dateTransferMap[model.dateType].to(now)
})

const dataTypeOptions: SelectOption[] = Object.entries(dateTransferMap).map(([key, value]) => {
    return {
        key,
        label: value.label,
        value: key,
    }
})
const addTextExample = () => {
    const now = new Date()
    model.text = dateTransferMap[model.dateType].to(now)
}
const message = useAnyMessage();
const result = computedAsync(async () => {
    let res: Result | undefined = undefined;
    try {
        const text = model.text || "";
        const dateType = model.dateType;
        await form?.value?.validate();
        let dateInstance: undefined | Date = undefined;
        const m = dateTransferMap[dateType]
        const isValid = m.validate(text);
        if (isValid) {
            dateInstance = m.from(text)
        }
        const list = Object.values(dateTransferMap).map(m => {
            let res = "";
            try {
                if (dateInstance) {
                    res = m.to(dateInstance)
                }
            } catch (error) {

            }
            return {
                ...m,
                result: res
            }
        })
        res = {
            list
        }
    } catch (error) {
        message.anyError(error);
        res = undefined;
    }

    return res
})
</script>