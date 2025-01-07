<template>
    <tool-content>
        <template #input>
            <n-form ref="formRef" :model="model">
                <tool-area label="输入">
                    <n-form-item path="dateType" label="热量类型" first>
                        <n-select :options="dataTypeOptions" v-model:value="model.type" />
                    </n-form-item>
                    <n-form-item path="text" label="热量" first>
                        <n-input-number placeholder="输入热量值" v-model:value="model.text" />
                    </n-form-item>
                </tool-area>
            </n-form>
        </template>
        <template #output>
            <key-value :item-label-width="120" :data="[
                ...textRes.map(item => ({ label: item.label, value: item.result, valueActions: [commonCopyAction(item.result)] }))
            ]" />
        </template>
    </tool-content>
</template>
<script setup lang="ts">
import type { SelectOption } from 'naive-ui';
import { type HeatType, heatTransferMap } from './utils';

export type Model = {
    type: HeatType,
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
    type: 'wh',
    text: 0
})
onMounted(() => {
    const base = 1;
    model.text = heatTransferMap[model.type].fromWh(base)
})

const dataTypeOptions: SelectOption[] = Object.entries(heatTransferMap).map(([key, value]) => {
    return {
        key,
        label: value.label,
        value: key,
    }
})

const textRes = computed(() => {
    const text = model.text;
    const type = model.type;
    let whVal: undefined | number = undefined;
    try {
        const m = heatTransferMap[type]
        whVal = m.toWh(text)
    } catch (error) {
    }

    return Object.values(heatTransferMap).map(m => {
        let res = 0;
        try {
            if (whVal !== undefined) {
                res = m.fromWh(whVal)
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