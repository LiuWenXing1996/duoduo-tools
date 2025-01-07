<template>
    <tool-content>
        <template #input>
            <n-form ref="formRef" :model="model">
                <tool-area label="输入">
                    <n-form-item path="dateType" label="功率类型" first>
                        <n-select :options="dataTypeOptions" v-model:value="model.type" />
                    </n-form-item>
                    <n-form-item path="text" label="功率" first>
                        <n-input-number placeholder="输入功率值" v-model:value="model.text" />
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
import { type PowerType, powerTransferMap } from './utils';

export type Model = {
    type: PowerType,
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
    type: 'w',
    text: 0
})
onMounted(() => {
    const base = 1;
    model.text = powerTransferMap[model.type].fromW(base)
})

const dataTypeOptions: SelectOption[] = Object.entries(powerTransferMap).map(([key, value]) => {
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
        const m = powerTransferMap[type]
        whVal = m.toW(text)
    } catch (error) {
    }

    return Object.values(powerTransferMap).map(m => {
        let res = 0;
        try {
            if (whVal !== undefined) {
                res = m.fromW(whVal)
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