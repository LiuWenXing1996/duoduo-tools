<template>
    <tool-content>
        <template #input>
            <n-form ref="formRef" :model="model">
                <tool-area label="输入">
                    <n-form-item path="dateType" label="面积类型" first>
                        <n-select :options="dataTypeOptions" v-model:value="model.type" />
                    </n-form-item>
                    <n-form-item path="text" label="面积" first>
                        <n-input-number placeholder="输入面积" v-model:value="model.text" />
                    </n-form-item>
                </tool-area>
            </n-form>
        </template>
        <template #output>
            <n-list hoverable clickable>
                <n-list-item v-for="groupItem in areaTypeGroup">
                    <n-thing :title="groupItem.label" content-style="margin-top: 10px;">
                        <key-value :item-label-width="120" :data="[
                            ...textRes.filter(e => groupItem.types.includes(e.type)).map(item => ({ label: item.label, value: item.result, valueActions: [commonCopyAction(item.result)] }))
                        ]" />
                    </n-thing>
                </n-list-item>
            </n-list>
        </template>
    </tool-content>
</template>
<script setup lang="ts">
import type { SelectOption } from 'naive-ui';
import { type AreaType, areaTransferMap, areaTypeGroup } from './utils';

export type Model = {
    type: AreaType,
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
    type: 'km',
    text: 0
})
onMounted(() => {
    const base = 1;
    model.text = areaTransferMap[model.type].formKm(base)
})

const dataTypeOptions: SelectOption[] = Object.entries(areaTransferMap).map(([key, value]) => {
    return {
        key,
        label: value.label,
        value: key,
    }
})

const textRes = computed(() => {
    const text = model.text || 0;
    const type = model.type;
    let kmVal: undefined | number = undefined;
    try {
        const m = areaTransferMap[type]
        kmVal = m.toKm(text)
    } catch (error) {
    }

    return Object.entries(areaTransferMap).map(([key, m]) => {
        let res = 0;
        try {
            if (kmVal !== undefined) {
                res = m.formKm(kmVal)
            }
        } catch (error) {

        }
        return {
            ...m,
            result: m.display(res),
            type: key as AreaType
        }
    })
})
</script>