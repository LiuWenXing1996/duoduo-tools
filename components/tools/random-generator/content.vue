<template>
    <tool-content>
        <template #input>
            <n-form ref="form" :model="model">
                <tool-area label="配置">
                    <n-form-item :="commonFormItemProps" path="count" label="数量">
                        <n-input-number v-model:value="model.count" :min="1" :step="1" />
                    </n-form-item>
                    <n-form-item :="commonFormItemProps" path="min" label="最小值">
                        <n-input-number v-model:value="model.min" :step="1" />
                    </n-form-item>
                    <n-form-item :="commonFormItemProps" path="max" label="最大值">
                        <n-input-number v-model:value="model.max" :step="1" />
                    </n-form-item>
                </tool-area>
            </n-form>
        </template>
        <template #output>
            <key-value :item-label-width="80" :data="[
                ...((resRequest.data.value?.list || []).map((item, index) => ({
                    label: `第 ${index + 1} 个`,
                    value: item.toString(),
                    valueCopy: true
                })))
            ]" />
        </template>
        <template #actions>
            <n-space>
                <n-button size="small" @click="resRequest.run()">重新生成</n-button>
                <n-button size="small" @click="copyAll">复制全部</n-button>
            </n-space>
        </template>
    </tool-content>
</template>

<script setup lang="tsx">
import { random, range } from "radash"

export type Model = {
    min: number,
    max: number,
    count: number,
}

export type Result = {
    list: number[],
}
const model = reactive<Model>({
    min: 0,
    max: 100,
    count: 10,
})

const formRef = useTemplateRef("form")
const resRequest = useCustomRequest<Result | undefined>(async () => {
    let res: Result | undefined = undefined;
    try {
        await formRef.value?.validate();
        const list = Array.from(range(model.count - 1)).map(() => random(model.min, model.max))
        res = {
            list
        }
    } catch (error) {
        resRequest.mutate(undefined)
        throw error
    }
    return res;
}, {
    loadingKeep: 0,
    debounceOptions: {
        leading: true
    }
})
const copy = useCopy()
const copyAll = () => {
    copy(resRequest.data.value?.list.map(item => item.toString()).join("\n"))
}
watch(() => model, () => {
    resRequest.run()
}, {
    immediate: true,
    deep: true
})

</script>