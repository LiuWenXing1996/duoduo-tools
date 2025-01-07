<template>
    <tool-content>
        <template #input>
            <n-form ref="formRef" :model="model">
                <tool-area label="输入">
                    <n-form-item path="dateType" label="时间类型" first>
                        <n-select :options="dataTypeOptions" v-model:value="model.type" />
                    </n-form-item>
                    <n-form-item path="text" label="时间" first>
                        <n-input-number placeholder="输入时间" v-model:value="model.text" />
                    </n-form-item>
                </tool-area>
            </n-form>
        </template>
        <template #output>
            <key-value :item-label-width="60" :data="[
                ...textRes.map(item => ({ label: item.label, value: item.result, valueActions: [commonCopyAction(item.result)] }))
            ]" />
        </template>
    </tool-content>
</template>
<script setup lang="ts">
import type { SelectOption } from 'naive-ui';
import { type TimeType, timeTransferMap } from './utils';

export type Model = {
    type: TimeType,
    text: number
}

const copy = useCopy()
const commonCopyAction = (content: string): IconButtonComponentProps | undefined => {
    if (!content) {
        return undefined
    }
    return {
        name: 'common-copy',
        onClick: () => {
            copy(content)
        },
    }
}
const model = reactive<Model>({
    type: 's',
    text: 0
})
onMounted(() => {
    const base = 3600;
    model.text = timeTransferMap[model.type].formSecond(base)
})

const dataTypeOptions: SelectOption[] = Object.entries(timeTransferMap).map(([key, value]) => {
    return {
        key,
        label: value.label,
        value: key,
    }
})

const textRes = computed(() => {
    const text = model.text;
    const type = model.type;
    let secondVal: undefined | number = undefined;
    try {
        const m = timeTransferMap[type]
        secondVal = m.toSecond(text)
    } catch (error) {
    }

    return Object.values(timeTransferMap).map(m => {
        let res = 0;
        try {
            if (secondVal !== undefined) {
                res = m.formSecond(secondVal)
            }
        } catch (error) {

        }
        return {
            ...m,
            result: m.display(res)
        }
    })
})
</script>