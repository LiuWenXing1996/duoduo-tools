<template>
    <tool-content>
        <template #input>
            <n-form ref="formRef" :model="model">
                <tool-area label="输入">
                    <n-form-item path="dateType" label="压力类型" first>
                        <n-select :options="dataTypeOptions" v-model:value="model.type" />
                    </n-form-item>
                    <n-form-item path="text" label="压力" first>
                        <n-input-number placeholder="输入压力值" v-model:value="model.text" />
                    </n-form-item>
                </tool-area>
            </n-form>
        </template>
        <template #output>
            <key-value :item-label-width="140" :data="[
                ...textRes.map(item => ({ label: item.label, value: item.result, valueActions: [commonCopyAction(item.result)] }))
            ]" />
        </template>
    </tool-content>
</template>
<script setup lang="ts">
import type { SelectOption } from 'naive-ui';
import { type PressureType, pressureTransferMap } from './utils';

export type Model = {
    type: PressureType,
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
    type: 'pa',
    text: 0
})
onMounted(() => {
    const base = 1;
    model.text = pressureTransferMap[model.type].formPa(base)
})

const dataTypeOptions: SelectOption[] = Object.entries(pressureTransferMap).map(([key, value]) => {
    return {
        key,
        label: value.label,
        value: key,
    }
})

const textRes = computed(() => {
    const text = model.text;
    const type = model.type;
    let paVal: undefined | number = undefined;
    try {
        const m = pressureTransferMap[type]
        paVal = m.toPa(text)
    } catch (error) {
    }

    return Object.values(pressureTransferMap).map(m => {
        let res = 0;
        try {
            if (paVal !== undefined) {
                res = m.formPa(paVal)
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