<template>
    <n-form ref="form" :model="model">
        <n-form-item :="commonFormItemProps" path="config.type" label="类型">
            <n-select :options="typeOptions" v-model:value="model.config.type" />
        </n-form-item>
        <template v-if="model.config.type === 'interval'">
            <n-form-item :="commonFormItemProps" path="config.interval.start" label="从 n 小时开始" :rule="[
                {
                    validator: (_, val) => {
                        if (val < 0) {
                            return false
                        }
                    },
                    message: '开始小时不能小于 0',
                    trigger: allFormItemTrigger
                },
                {
                    validator: (_, val) => {
                        if (val > 23) {
                            return false
                        }
                    },
                    message: '开始小时不能大于 23',
                    trigger: allFormItemTrigger
                },
                {
                    validator: (_, val) => {
                        if (val > model.config.interval.end) {
                            return false
                        }
                    },
                    message: '开始小时不能大于结束小时',
                    trigger: allFormItemTrigger
                }
            ]">
                <n-input-number v-model:value="model.config.interval.start" min="0" max="23" />
            </n-form-item>
            <n-form-item :="commonFormItemProps" path="config.interval.end" label="到 m 小时结束" :rule="[
                {
                    validator: (_, val) => {
                        if (val < 0) {
                            return false
                        }
                    },
                    message: '结束小时不能小于 0',
                    trigger: allFormItemTrigger
                },
                {
                    validator: (_, val) => {
                        if (val > 23) {
                            return false
                        }
                    },
                    message: '结束小时不能大于 23',
                    trigger: allFormItemTrigger
                },
                {
                    validator: (_, val) => {
                        if (val < model.config.interval.start) {
                            return false
                        }
                    },
                    message: '结束小时不能小于开始小时',
                    trigger: allFormItemTrigger
                }
            ]">
                <n-input-number v-model:value="model.config.interval.end" min="0" max="23" />
            </n-form-item>
        </template>
        <template v-else-if="model.config.type === 'start-per'">
            <n-form-item :="commonFormItemProps" path="config.startPer.start" label="从 n 小时开始" :rule="[
                {
                    validator: (_, val) => {
                        if (val < 0) {
                            return false
                        }
                    },
                    message: '开始小时不能小于 0',
                    trigger: allFormItemTrigger
                },
                {
                    validator: (_, val) => {
                        if (val > 23) {
                            return false
                        }
                    },
                    message: '开始小时不能大于 23',
                    trigger: allFormItemTrigger
                }
            ]">
                <n-input-number v-model:value="model.config.startPer.start" min="0" max="23" />
            </n-form-item>
            <n-form-item :="commonFormItemProps" path="config.startPer.per" label="每 m 小时执行一次" :rule="[
                {
                    validator: (_, val) => {
                        if (val < 0) {
                            return false
                        }
                    },
                    message: '执行小时间隔不能小于 0',
                    trigger: allFormItemTrigger
                },
                {
                    validator: (_, val) => {
                        if (val > 23) {
                            return false
                        }
                    },
                    message: '执行小时间隔不能大于 23',
                    trigger: allFormItemTrigger
                }
            ]">
                <n-input-number v-model:value="model.config.startPer.per" min="0" max="23" />
            </n-form-item>
        </template>
        <template v-else-if="model.config.type === 'list'">
            <n-form-item :="commonFormItemProps" path="config.list" label="小时列表" :rule="[
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
                    message: '小时列表不能为空',
                    trigger: allFormItemTrigger
                }
            ]">
                <n-checkbox-group v-model:value="model.config.list">
                    <n-space>
                        <template v-for="i in range(23)">
                            <n-checkbox :="{
                                key: i,
                                value: i,
                                label: i.toString() + '点'
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
import { type CronHourOptions } from './utils'
import type { DeepRequired } from 'ts-essentials'

export type Model = {
    config: DeepRequired<UnionMerge<CronHourOptions>>
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
const typeOptions = defineSelectOptionList<Record<CronHourOptions['type'], unknown>>({
    per: { label: '每小时' },
    interval: { label: '从 n 小时 到 m 小时' },
    "start-per": { label: '从 n 小时开始，每 m 小时执行一次' },
    list: { label: '指定哪几小时' }
})

defineExpose({
    formRef,
    model
})

</script>