<template>
    <n-form ref="form" :model="model">
        <common-form-item-select :type="'common'" :custom="{
            formItem: {
                label: '类型',
            },
            select: {
                options: typeOptions,
                value: model.config.type,
                onUpdateValue: (val) => { model.config.type = val }
            }
        }" />
        <template v-if="model.config.type === 'interval'">
            <common-form-item-input-number :type="'common'" :custom="{
                formItem: {
                    label: '从 n 月开始',
                    path: 'config.interval.start',
                    rule: [
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
                    ]
                },
                inputNumber: {
                    min: 1,
                    max: 12,
                    value: model.config.interval.start,
                    onUpdateValue: (val) => { model.config.interval.start = val ?? 0 }
                }
            }" />
            <common-form-item-input-number :type="'common'" :custom="{
                formItem: {
                    label: '从 m 月结束',
                    path: 'config.interval.end',
                    rule: [
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
                    ]
                },
                inputNumber: {
                    min: 1,
                    max: 12,
                    value: model.config.interval.end,
                    onUpdateValue: (val) => { model.config.interval.end = val ?? 0 }
                }
            }" />
        </template>
        <template v-else-if="model.config.type === 'start-per'">
            <common-form-item-input-number :type="'common'" :custom="{
                formItem: {
                    label: '从 n 月开始',
                    path: 'config.startPer.start',
                    rule: [
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
                    ]
                },
                inputNumber: {
                    min: 1,
                    max: 12,
                    value: model.config.startPer.start,
                    onUpdateValue: (val) => { model.config.startPer.start = val ?? 0 }
                }
            }" />
            <common-form-item-input-number :type="'common'" :custom="{
                formItem: {
                    label: '每 m 月执行一次',
                    path: 'config.startPer.per',
                    rule: [
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
                    ]
                },
                inputNumber: {
                    min: 1,
                    max: 12,
                    value: model.config.startPer.per,
                    onUpdateValue: (val) => { model.config.startPer.per = val ?? 0 }
                }
            }" />
        </template>
        <template v-else-if="model.config.type === 'list'">
            <common-form-item-checkbox :type="'common'" :custom="{
                formItem: {
                    label: '月份列表',
                    path: 'config.list',
                    rule: [
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
                    ]
                },
                checkboxGroup: {
                    value: model.config.list,
                    onUpdateValue: (val) => { model.config.list = val.map(e => Number(e)) }
                },
                checkboxList: [...range(1, 12)].map(i => {
                    return {
                        key: i,
                        value: i,
                        label: i.toString() + '月'
                    }
                })
            }" />
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