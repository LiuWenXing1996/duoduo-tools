<template>
    <define-tool-wrapper>
        <template #input>
            <n-form ref="formRef" :model="model">
                <define-tool-area label="输入">
                    <n-form-item path="dateType" label="温度类型" first>
                        <n-select :options="dataTypeOptions" v-model:value="model.type" />
                    </n-form-item>
                    <n-form-item path="text" label="温度" first>
                        <n-input-number placeholder="输入温度" v-model:value="model.text" />
                    </n-form-item>
                </define-tool-area>
            </n-form>
        </template>
        <template #output>
            <common-key-value :item-label-width="140" :data="[
                ...textRes.map(item => ({ label: item.label, value: item.result, valueActions: [commonCopyAction(item.result)] }))
            ]" />
        </template>
    </define-tool-wrapper>
</template>
<script setup lang="ts">
import type { SelectOption } from 'naive-ui';
import { type TemperatureType, temperatureTransferMap } from './utils';

export type Model = {
    type: TemperatureType,
    text: number
}

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
const model = reactive<Model>({
    type: 'Kelvin',
    text: 0
})
onMounted(() => {
    const base = 100;
    model.text = temperatureTransferMap[model.type].formKelvin(base)
})

const dataTypeOptions: SelectOption[] = Object.entries(temperatureTransferMap).map(([key, value]) => {
    return {
        key,
        label: value.label,
        value: key,
    }
})

const textRes = computed(() => {
    const text = model.text;
    const type = model.type;
    let kelvinVal: undefined | number = undefined;
    try {
        const m = temperatureTransferMap[type]
        kelvinVal = m.toKelvin(text)
    } catch (error) {
    }

    return Object.values(temperatureTransferMap).map(m => {
        let res = 0;
        try {
            if (kelvinVal !== undefined) {
                res = m.formKelvin(kelvinVal)
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