<template>
    <n-form ref="form" :model="model">
        <n-form-item :="commonFormItemProps" path="config.type" label="类型">
            <n-select :options="typeOptions" v-model:value="model.config.type" />
        </n-form-item>
        <template v-if="model.config.type === 'interval'">
            <n-form-item :="commonFormItemProps" path="config.interval.start" label="从 n 号开始" :rule="[
                {
                    validator: (_, val) => {
                        if (val < 1) {
                            return false
                        }
                    },
                    message: '开始号不能小于 1',
                    trigger: allFormItemTrigger
                },
                {
                    validator: (_, val) => {
                        if (val > 31) {
                            return false
                        }
                    },
                    message: '开始号不能大于 31',
                    trigger: allFormItemTrigger
                },
                {
                    validator: (_, val) => {
                        if (val > model.config.interval.end) {
                            return false
                        }
                    },
                    message: '开始号不能大于结束号',
                    trigger: allFormItemTrigger
                }
            ]">
                <n-input-number v-model:value="model.config.interval.start" :min="1" :max="31" />
            </n-form-item>
            <n-form-item :="commonFormItemProps" path="config.interval.end" label="到 m 号结束" :rule="[
                {
                    validator: (_, val) => {
                        if (val < 1) {
                            return false
                        }
                    },
                    message: '结束号不能小于 1',
                    trigger: allFormItemTrigger
                },
                {
                    validator: (_, val) => {
                        if (val > 31) {
                            return false
                        }
                    },
                    message: '结束号不能大于 31',
                    trigger: allFormItemTrigger
                },
                {
                    validator: (_, val) => {
                        if (val < model.config.interval.start) {
                            return false
                        }
                    },
                    message: '结束号不能小于开始号',
                    trigger: allFormItemTrigger
                }
            ]">
                <n-input-number v-model:value="model.config.interval.end" :min="1" :max="31" />
            </n-form-item>
        </template>
        <template v-else-if="model.config.type === 'start-per'">
            <n-form-item :="commonFormItemProps" path="config.startPer.start" label="从 n 号开始" :rule="[
                {
                    validator: (_, val) => {
                        if (val < 1) {
                            return false
                        }
                    },
                    message: '开始号不能小于 1',
                    trigger: allFormItemTrigger
                },
                {
                    validator: (_, val) => {
                        if (val > 31) {
                            return false
                        }
                    },
                    message: '开始号不能大于 31',
                    trigger: allFormItemTrigger
                }
            ]">
                <n-input-number v-model:value="model.config.startPer.start" :min="1" :max="31" />
            </n-form-item>
            <n-form-item :="commonFormItemProps" path="config.startPer.per" label="每 m 天执行一次" :rule="[
                {
                    validator: (_, val) => {
                        if (val < 1) {
                            return false
                        }
                    },
                    message: '执行天数间隔不能小于 1',
                    trigger: allFormItemTrigger
                },
                {
                    validator: (_, val) => {
                        if (val > 31) {
                            return false
                        }
                    },
                    message: '执行天数间隔不能大于 31',
                    trigger: allFormItemTrigger
                }
            ]">
                <n-input-number v-model:value="model.config.startPer.per" :min="1" :max="31" />
            </n-form-item>
        </template>
        <template v-else-if="model.config.type === 'work'">
            <n-form-item :="commonFormItemProps" path="config.work" label="在 n 号最近的工作日" :rule="[
                {
                    validator: (_, val) => {
                        if (val < 1) {
                            return false
                        }
                    },
                    message: '工作日附近的天号不能小于 1',
                    trigger: allFormItemTrigger
                },
                {
                    validator: (_, val) => {
                        if (val > 31) {
                            return false
                        }
                    },
                    message: '工作日附近的天号不能大于 31',
                    trigger: allFormItemTrigger
                }
            ]">
                <n-input-number v-model:value="model.config.work" :min="1" :max="31" />
            </n-form-item>
        </template>
        <template v-else-if="model.config.type === 'list'">
            <n-form-item :="commonFormItemProps" path="config.list" label="天号列表s" :rule="[
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
                    message: '天号列表不能为空',
                    trigger: allFormItemTrigger
                }
            ]">
                <n-checkbox-group v-model:value="model.config.list">
                    <n-space>
                        <template v-for="i in range(1, 31)">
                            <n-checkbox :="{
                                key: i,
                                value: i,
                                label: i.toString() + '号'
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
import { type CronDayOptions } from './utils'
import type { DeepRequired } from 'ts-essentials'

export type Model = {
    config: DeepRequired<UnionMerge<CronDayOptions>>
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
        work: 10,
        list: []
    },
})

const formRef = useTemplateRef("form")
const typeOptions = defineSelectOptionList<Record<CronDayOptions['type'], unknown>>({
    per: { label: '每天' },
    none: { label: "不指定" },
    interval: { label: '从 n 号到 m 号' },
    "start-per": { label: '从 n 号开始，每 m 天执行一次' },
    work: { label: "每月 n 号最近的那个工作日" },
    last: { label: "本月最后一天" },
    list: { label: '指定哪几天' }
})

defineExpose({
    formRef,
    model
})

</script>