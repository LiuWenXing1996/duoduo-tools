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
                    label: '从 n 小时开始',
                    path: 'config.interval.start',
                    rule: [
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
                    ]
                },
                inputNumber: {
                    min: 0,
                    max: 23,
                    value: model.config.interval.start,
                    onUpdateValue: (val) => { model.config.interval.start = val ?? 0 }
                }
            }" />
            <common-form-item-input-number :type="'common'" :custom="{
                formItem: {
                    label: '从 m 小时结束',
                    path: 'config.interval.end',
                    rule: [
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
                    ]
                },
                inputNumber: {
                    min: 0,
                    max: 23,
                    value: model.config.interval.end,
                    onUpdateValue: (val) => { model.config.interval.end = val ?? 0 }
                }
            }" />
        </template>
        <template v-else-if="model.config.type === 'start-per'">
            <common-form-item-input-number :type="'common'" :custom="{
                formItem: {
                    label: '从 n 小时开始',
                    path: 'config.startPer.start',
                    rule: [
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
                    ]
                },
                inputNumber: {
                    min: 0,
                    max: 23,
                    value: model.config.startPer.start,
                    onUpdateValue: (val) => { model.config.startPer.start = val ?? 0 }
                }
            }" />
            <common-form-item-input-number :type="'common'" :custom="{
                formItem: {
                    label: '每 m 小时执行一次',
                    path: 'config.startPer.per',
                    rule: [
                        {
                            validator: (_, val) => {
                                if (val < 1) {
                                    return false
                                }
                            },
                            message: '执行小时间隔不能小于 1',
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
                    ]
                },
                inputNumber: {
                    min: 1,
                    max: 23,
                    value: model.config.startPer.per,
                    onUpdateValue: (val) => { model.config.startPer.per = val ?? 0 }
                }
            }" />
        </template>
        <template v-else-if="model.config.type === 'list'">
            <common-form-item-checkbox :type="'common'" :custom="{
                formItem: {
                    label: '小时列表',
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
                            message: '小时列表不能为空',
                            trigger: allFormItemTrigger
                        }
                    ]
                },
                checkboxGroup: {
                    value: model.config.list,
                    onUpdateValue: (val) => { model.config.list = val.map(e => Number(e)) }
                },
                checkboxList: [...range(23)].map(i => {
                    return {
                        key: i,
                        value: i,
                        label: i.toString() + '点'
                    }
                })
            }" />
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