<template>
    <n-form ref="form" :model="model">
        <n-form-item :="commonFormItemProps" path="config.type" label="类型">
            <n-select :options="typeOptions" v-model:value="model.config.type" />
        </n-form-item>
        <template v-if="model.config.type === 'interval'">
            <n-form-item :="commonFormItemProps" path="config.interval.start" label="从 n 月开始" :rule="[
                {
                    validator: (_, val) => {
                        if (val < 1) {
                            return false
                        }
                    },
                    message: '开始月份不能小于 1',
                    trigger: allFormItemTrigger
                },
                {
                    validator: (_, val) => {
                        if (val > 12) {
                            return false
                        }
                    },
                    message: '开始月份不能大于 12',
                    trigger: allFormItemTrigger
                },
                {
                    validator: (_, val) => {
                        if (val > model.config.interval.end) {
                            return false
                        }
                    },
                    message: '开始月份不能大于结束月份',
                    trigger: allFormItemTrigger
                }
            ]">
                <n-input-number v-model:value="model.config.interval.start" min="1" max="12" />
            </n-form-item>
            <n-form-item :="commonFormItemProps" path="config.interval.end" label="到 m 月结束" :rule="[
                {
                    validator: (_, val) => {
                        if (val < 1) {
                            return false
                        }
                    },
                    message: '结束月份不能小于 1',
                    trigger: allFormItemTrigger
                },
                {
                    validator: (_, val) => {
                        if (val > 12) {
                            return false
                        }
                    },
                    message: '结束月份不能大于 12',
                    trigger: allFormItemTrigger
                },
                {
                    validator: (_, val) => {
                        if (val < model.config.interval.start) {
                            return false
                        }
                    },
                    message: '结束月份不能小于开始月份',
                    trigger: allFormItemTrigger
                }
            ]">
                <n-input-number v-model:value="model.config.interval.end" min="1" max="12" />
            </n-form-item>
        </template>
        <template v-else-if="model.config.type === 'start-per'">
            <n-form-item :="commonFormItemProps" path="config.startPer.start" label="从 n 月开始" :rule="[
                {
                    validator: (_, val) => {
                        if (val < 1) {
                            return false
                        }
                    },
                    message: '开始月份不能小于 1',
                    trigger: allFormItemTrigger
                },
                {
                    validator: (_, val) => {
                        if (val > 12) {
                            return false
                        }
                    },
                    message: '开始月份不能大于 12',
                    trigger: allFormItemTrigger
                }
            ]">
                <n-input-number v-model:value="model.config.startPer.start" min="1" max="12" />
            </n-form-item>
            <n-form-item :="commonFormItemProps" path="config.startPer.per" label="每 m 月执行一次" :rule="[
                {
                    validator: (_, val) => {
                        if (val < 1) {
                            return false
                        }
                    },
                    message: '执行月份间隔不能小于 1',
                    trigger: allFormItemTrigger
                },
                {
                    validator: (_, val) => {
                        if (val > 12) {
                            return false
                        }
                    },
                    message: '执行月份间隔不能大于 12',
                    trigger: allFormItemTrigger
                }
            ]">
                <n-input-number v-model:value="model.config.startPer.per" min="1" max="12" />
            </n-form-item>
        </template>
        <template v-else-if="model.config.type === 'list'">
            <n-form-item :="commonFormItemProps" path="config.list" label="月份列表" :rule="[
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
                    message: '月份列表不能为空',
                    trigger: allFormItemTrigger
                }
            ]">
                <n-checkbox-group v-model:value="model.config.list">
                    <n-space>
                        <template v-for="i in range(1, 12)">
                            <n-checkbox :="{
                                key: i,
                                value: i,
                                label: i.toString() + '月'
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
import { type CronMonthOptions } from './utils'
import type { DeepRequired } from 'ts-essentials'

export type Model = {
    config: DeepRequired<UnionMerge<CronMonthOptions>>
}

const model = reactive<Model>({
    config: {
        type: "per",
        interval: {
            start: 7,
            end: 8
        },
        startPer: {
            start: 5,
            per: 2
        },
        list: []
    },
})

const formRef = useTemplateRef("form")
const typeOptions = defineSelectOptionList<Record<CronMonthOptions['type'], unknown>>({
    per: { label: '每月' },
    interval: { label: '从 n 月 到 m 月' },
    "start-per": { label: '从 n 月开始，每 m 月执行一次' },
    list: { label: '指定哪几月' }
})

defineExpose({
    formRef,
    model
})

</script>