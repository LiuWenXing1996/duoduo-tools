<template>
    <n-form ref="form" :model="model">
        <n-form-item :="commonFormItemProps" path="config.type" label="类型">
            <n-select :options="typeOptions" v-model:value="model.config.type" />
        </n-form-item>
        <template v-if="model.config.type === 'interval'">
            <n-form-item :="commonFormItemProps" path="config.interval.start" label="从 n 秒开始" :rule="[
                {
                    validator: (_, val) => {
                        if (val < 0) {
                            return false
                        }
                    },
                    message: '开始秒不能小于 0',
                    trigger: allFormItemTrigger
                },
                {
                    validator: (_, val) => {
                        if (val > 59) {
                            return false
                        }
                    },
                    message: '开始秒不能大于 59',
                    trigger: allFormItemTrigger
                },
                {
                    validator: (_, val) => {
                        if (val > model.config.interval.end) {
                            return false
                        }
                    },
                    message: '开始秒不能大于结束秒',
                    trigger: allFormItemTrigger
                }
            ]">
                <n-input-number v-model:value="model.config.interval.start" min="0" max="59" />
            </n-form-item>
            <n-form-item :="commonFormItemProps" path="config.interval.end" label="到 m 秒结束" :rule="[
                {
                    validator: (_, val) => {
                        if (val < 0) {
                            return false
                        }
                    },
                    message: '结束秒不能小于 0',
                    trigger: allFormItemTrigger
                },
                {
                    validator: (_, val) => {
                        if (val > 59) {
                            return false
                        }
                    },
                    message: '结束秒不能大于 59',
                    trigger: allFormItemTrigger
                },
                {
                    validator: (_, val) => {
                        if (val < model.config.interval.start) {
                            return false
                        }
                    },
                    message: '结束秒不能小于开始秒',
                    trigger: allFormItemTrigger
                }
            ]">
                <n-input-number v-model:value="model.config.interval.end" min="0" max="59" />
            </n-form-item>
        </template>
        <template v-else-if="model.config.type === 'start-per'">
            <n-form-item :="commonFormItemProps" path="config.startPer.start" label="从 n 秒开始" :rule="[
                {
                    validator: (_, val) => {
                        if (val < 0) {
                            return false
                        }
                    },
                    message: '开始秒不能小于 0',
                    trigger: allFormItemTrigger
                },
                {
                    validator: (_, val) => {
                        if (val > 59) {
                            return false
                        }
                    },
                    message: '开始秒不能大于 59',
                    trigger: allFormItemTrigger
                }
            ]">
                <n-input-number v-model:value="model.config.startPer.start" min="0" max="59" />
            </n-form-item>
            <n-form-item :="commonFormItemProps" path="config.startPer.per" label="每 m 秒执行一次" :rule="[
                {
                    validator: (_, val) => {
                        if (val < 0) {
                            return false
                        }
                    },
                    message: '执行秒间隔不能小于 0',
                    trigger: allFormItemTrigger
                },
                {
                    validator: (_, val) => {
                        if (val > 59) {
                            return false
                        }
                    },
                    message: '执行秒间隔不能大于 59',
                    trigger: allFormItemTrigger
                }
            ]">
                <n-input-number v-model:value="model.config.startPer.per" min="0" max="59" />
            </n-form-item>
        </template>
        <template v-else-if="model.config.type === 'list'">
            <n-form-item :="commonFormItemProps" path="config.list" label="秒列表" :rule="[
                {
                    validator: (_, val) => {
                        if (!val) {
                            return false
                        }
                        if (val.length <= 0) {
                            return false
                        }
                        return true
                    },
                    message: '秒列表不能为空',
                    trigger: allFormItemTrigger
                }
            ]">
                <n-checkbox-group v-model:value="model.config.list">
                    <n-space>
                        <template v-for="i in range(59)">
                            <n-checkbox :="{
                                key: i,
                                value: i,
                                label: i.toString() + '秒'
                            }" />
                        </template>
                    </n-space>
                </n-checkbox-group>
            </n-form-item>
        </template>
    </n-form>
</template>
<script setup lang="tsx">
import { range } from 'radash'
import type { DeepRequired } from 'ts-essentials'
import { type CronSecondOptions } from './utils'

export type Model = {
    config: DeepRequired<UnionMerge<CronSecondOptions>>
}

const model = reactive<Model>({
    config: {
        type: "per",
        interval: {
            start: 10,
            end: 15
        },
        startPer: {
            start: 5,
            per: 2
        },
        list: []
    },
})

const formRef = useTemplateRef("form")
const typeOptions = defineSelectOptionList<Record<CronSecondOptions['type'], unknown>>({
    per: { label: '每秒' },
    interval: { label: '从 n 秒 到 m 秒' },
    "start-per": { label: '从 n 秒开始，每 m 秒执行一次' },
    list: { label: '指定哪几秒' }
})

defineExpose({
    formRef,
    model
})

</script>