<template>
    <tool-content>
        <template #input>
            <n-form ref="formRef" :model="model">
                <tool-area label="输入">
                    <n-form-item path="dateType" label="长度类型" first>
                        <n-select :options="dataTypeOptions" v-model:value="model.type" />
                    </n-form-item>
                    <n-form-item path="text" label="长度" first>
                        <n-input-number placeholder="输入长度" v-model:value="model.text" />
                    </n-form-item>
                </tool-area>
            </n-form>
        </template>
        <template #output>
            <n-list hoverable clickable>
                <n-list-item v-for="groupItem in weightTypeGroup">
                    <n-thing :title="groupItem.label" content-style="margin-top: 10px;">
                        <key-value :item-label-width="100" :data="[
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
import { type WeightType, weightTransferMap, weightTypeGroup } from './utils';

export type Model = {
    type: WeightType,
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
    type: 't',
    text: 0
})
onMounted(() => {
    const base = 1;
    model.text = weightTransferMap[model.type].formT(base)
})

const dataTypeOptions: SelectOption[] = Object.entries(weightTransferMap).map(([key, value]) => {
    return {
        key,
        label: value.label,
        value: key,
    }
})

const textRes = computed(() => {
    const text = model.text || 0;
    const type = model.type;
    let tVal: undefined | number = undefined;
    try {
        const m = weightTransferMap[type]
        tVal = m.toT(text)
    } catch (error) {
    }

    return Object.entries(weightTransferMap).map(([key, m]) => {
        let res = 0;
        try {
            if (tVal !== undefined) {
                res = m.formT(tVal)
            }
        } catch (error) {

        }
        return {
            ...m,
            result: m.display(res),
            type: key as WeightType
        }
    })
})
</script>