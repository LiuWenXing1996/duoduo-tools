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
                    label: '从 n 分钟开始',
                    path: 'config.interval.start',
                    rule: [
                        {
                            validator: (_, val) => {
                                if (val < 0) {
                                    return false
                                }
                            },
                            message: '开始分钟不能小于 0',
                            trigger: allFormItemTrigger
                        },
                        {
                            validator: (_, val) => {
                                if (val > 59) {
                                    return false
                                }
                            },
                            message: '开始分钟不能大于 59',
                            trigger: allFormItemTrigger
                        },
                        {
                            validator: (_, val) => {
                                if (val > model.config.interval.end) {
                                    return false
                                }
                            },
                            message: '开始分钟不能大于结束分钟',
                            trigger: allFormItemTrigger
                        }
                    ]
                },
                inputNumber: {
                    min: 0,
                    max: 59,
                    value: model.config.interval.start,
                    onUpdateValue: (val) => { model.config.interval.start = val ?? 0 }
                }
            }" />
            <common-form-item-input-number :type="'common'" :custom="{
                formItem: {
                    label: '从 m 分钟结束',
                    path: 'config.interval.end',
                    rule: [
                        {
                            validator: (_, val) => {
                                if (val < 0) {
                                    return false
                                }
                            },
                            message: '结束分钟不能小于 0',
                            trigger: allFormItemTrigger
                        },
                        {
                            validator: (_, val) => {
                                if (val > 59) {
                                    return false
                                }
                            },
                            message: '结束分钟不能大于 59',
                            trigger: allFormItemTrigger
                        },
                        {
                            validator: (_, val) => {
                                if (val < model.config.interval.start) {
                                    return false
                                }
                            },
                            message: '结束分钟不能小于开始分钟',
                            trigger: allFormItemTrigger
                        }
                    ]
                },
                inputNumber: {
                    min: 0,
                    max: 59,
                    value: model.config.interval.end,
                    onUpdateValue: (val) => { model.config.interval.end = val ?? 0 }
                }
            }" />
        </template>
        <template v-else-if="model.config.type === 'start-per'">
            <common-form-item-input-number :type="'common'" :custom="{
                formItem: {
                    label: '从 n 分钟开始',
                    path: 'config.startPer.start',
                    rule: [
                        {
                            validator: (_, val) => {
                                if (val < 0) {
                                    return false
                                }
                            },
                            message: '开始分钟不能小于 0',
                            trigger: allFormItemTrigger
                        },
                        {
                            validator: (_, val) => {
                                if (val > 59) {
                                    return false
                                }
                            },
                            message: '开始分钟不能大于 59',
                            trigger: allFormItemTrigger
                        }
                    ]
                },
                inputNumber: {
                    min: 0,
                    max: 59,
                    value: model.config.startPer.start,
                    onUpdateValue: (val) => { model.config.startPer.start = val ?? 0 }
                }
            }" />
            <common-form-item-input-number :type="'common'" :custom="{
                formItem: {
                    label: '每 m 分钟执行一次',
                    path: 'config.startPer.per',
                    rule: [
                        {
                            validator: (_, val) => {
                                if (val < 0) {
                                    return false
                                }
                            },
                            message: '执行分钟间隔不能小于 0',
                            trigger: allFormItemTrigger
                        },
                        {
                            validator: (_, val) => {
                                if (val > 59) {
                                    return false
                                }
                            },
                            message: '执行分钟间隔不能大于 59',
                            trigger: allFormItemTrigger
                        }
                    ]
                },
                inputNumber: {
                    min: 0,
                    max: 59,
                    value: model.config.startPer.per,
                    onUpdateValue: (val) => { model.config.startPer.per = val ?? 0 }
                }
            }" />
        </template>
        <template v-else-if="model.config.type === 'list'">
            <common-form-item-checkbox :type="'common'" :custom="{
                formItem: {
                    label: '分钟列表',
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
                            message: '分钟列表不能为空',
                            trigger: allFormItemTrigger
                        }
                    ]
                },
                checkboxGroup: {
                    value: model.config.list,
                    onUpdateValue: (val) => { model.config.list = val.map(e => Number(e)) }
                },
                checkboxList: [...range(59)].map(i => {
                    return {
                        key: i,
                        value: i,
                        label: i.toString()
                    }
                })
            }" />
        </template>
    </n-form>
</template>
<script setup lang="tsx">
import { range } from 'radash'
import { type CronMinuteOptions } from './utils'
import type { DeepRequired } from 'ts-essentials'

export type Model = {
    config: DeepRequired<UnionMerge<CronMinuteOptions>>
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
const typeOptions = defineSelectOptionList<Record<CronMinuteOptions['type'], unknown>>({
    per: { label: '每分钟' },
    interval: { label: '从 n 分钟 到 m 分钟' },
    "start-per": { label: '从 n 分钟开始，每 m 分钟执行一次' },
    list: { label: '指定哪几分钟' }
})

defineExpose({
    formRef,
    model
})

</script>