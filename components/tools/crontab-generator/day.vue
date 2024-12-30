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
                    label: '从 n 号开始',
                    path: 'config.interval.start',
                    rule: [
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
                    ]
                },
                inputNumber: {
                    min: 1,
                    max: 31,
                    value: model.config.interval.start,
                    onUpdateValue: (val) => { model.config.interval.start = val ?? 0 }
                }
            }" />
            <common-form-item-input-number :type="'common'" :custom="{
                formItem: {
                    label: '从 m 号结束',
                    path: 'config.interval.end',
                    rule: [
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
                    ]
                },
                inputNumber: {
                    min: 1,
                    max: 31,
                    value: model.config.interval.end,
                    onUpdateValue: (val) => { model.config.interval.end = val ?? 0 }
                }
            }" />
        </template>
        <template v-else-if="model.config.type === 'start-per'">
            <common-form-item-input-number :type="'common'" :custom="{
                formItem: {
                    label: '从 n 号开始',
                    path: 'config.startPer.start',
                    rule: [
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
                    ]
                },
                inputNumber: {
                    min: 1,
                    max: 31,
                    value: model.config.startPer.start,
                    onUpdateValue: (val) => { model.config.startPer.start = val ?? 0 }
                }
            }" />
            <common-form-item-input-number :type="'common'" :custom="{
                formItem: {
                    label: '每 m 天执行一次',
                    path: 'config.startPer.per',
                    rule: [
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
                    ]
                },
                inputNumber: {
                    min: 1,
                    max: 31,
                    value: model.config.startPer.per,
                    onUpdateValue: (val) => { model.config.startPer.per = val ?? 0 }
                }
            }" />
        </template>
        <template v-else-if="model.config.type === 'work'">
            <common-form-item-input-number :type="'common'" :custom="{
                formItem: {
                    label: '在 n 号最近的工作日',
                    path: 'config.work',
                    rule: [
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
                    ]
                },
                inputNumber: {
                    min: 1,
                    max: 31,
                    value: model.config.work,
                    onUpdateValue: (val) => { model.config.work = val ?? 0 }
                }
            }" />
        </template>
        <template v-else-if="model.config.type === 'list'">
            <common-form-item-checkbox :type="'common'" :custom="{
                formItem: {
                    label: '天号列表',
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
                            message: '天号列表不能为空',
                            trigger: allFormItemTrigger
                        }
                    ]
                },
                checkboxGroup: {
                    value: model.config.list,
                    onUpdateValue: (val) => { model.config.list = val.map(e => Number(e)) }
                },
                checkboxList: [...range(1, 31)].map(i => {
                    return {
                        key: i,
                        value: i,
                        label: i.toString() + '号'
                    }
                })
            }" />
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