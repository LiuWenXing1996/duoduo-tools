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
            <common-form-item-radio :type="'common'" :custom="{
                formItem: {
                    label: '从星期 n 开始',
                    path: 'config.interval.start',
                    rule: [
                        {
                            validator: (_, val) => {
                                if (val < 1) {
                                    return false
                                }
                            },
                            message: '开始星期不能小于 1',
                            trigger: allFormItemTrigger
                        },
                        {
                            validator: (_, val) => {
                                if (val > 7) {
                                    return false
                                }
                            },
                            message: '开始星期不能大于 7',
                            trigger: allFormItemTrigger
                        },
                        {
                            validator: (_, val) => {
                                if (val > model.config.interval.end) {
                                    return false
                                }
                            },
                            message: '开始星期不能大于结束星期',
                            trigger: allFormItemTrigger
                        }
                    ],
                },
                radioGroup: {
                    value: model.config.interval.start,
                    onUpdateValue: (val) => { model.config.interval.start = val }
                },
                radioList: [...range(1, 7)].map(i => {
                    return {
                        key: i,
                        value: i,
                        label: weekName[i - 1]
                    }
                })
            }" />
            <common-form-item-radio :type="'common'" :custom="{
                formItem: {
                    label: '到星期 m 结束',
                    path: 'config.interval.end',
                    rule: [
                        {
                            validator: (_, val) => {
                                if (val < 1) {
                                    return false
                                }
                            },
                            message: '结束星期不能小于 1',
                            trigger: allFormItemTrigger
                        },
                        {
                            validator: (_, val) => {
                                if (val > 7) {
                                    return false
                                }
                            },
                            message: '结束星期不能大于 7',
                            trigger: allFormItemTrigger
                        },
                        {
                            validator: (_, val) => {
                                if (val < model.config.interval.start) {
                                    return false
                                }
                            },
                            message: '结束星期不能小于开始星期',
                            trigger: allFormItemTrigger
                        }
                    ],
                },
                radioGroup: {
                    value: model.config.interval.end,
                    onUpdateValue: (val) => { model.config.interval.end = val }
                },
                radioList: [...range(1, 7)].map(i => {
                    return {
                        key: i,
                        value: i,
                        label: weekName[i - 1]
                    }
                })
            }" />
        </template>
        <template v-else-if="model.config.type === 'week'">
            <common-form-item-radio :type="'common'" :custom="{
                formItem: {
                    label: '第 n 周',
                },
                radioGroup: {
                    value: model.config.week.weekNo,
                    onUpdateValue: (val) => { model.config.week.weekNo = val }
                },
                radioList: [...range(1, 5)].map(i => {
                    return {
                        key: i,
                        value: i,
                        label: '第' + i.toString() + '周'
                    }
                })
            }" />
            <common-form-item-radio :type="'common'" :custom="{
                formItem: {
                    label: '星期 m',
                },
                radioGroup: {
                    value: model.config.week.weekVal,
                    onUpdateValue: (val) => { model.config.week.weekVal = val }
                },
                radioList: [...range(1, 7)].map(i => {
                    return {
                        key: i,
                        value: i,
                        label: weekName[i - 1]
                    }
                })
            }" />
        </template>
        <template v-else-if="model.config.type === 'last'">
            <common-form-item-radio :type="'common'" :custom="{
                formItem: {
                    label: '星期 n',
                },
                radioGroup: {
                    value: model.config.last,
                    onUpdateValue: (val) => { model.config.last = val }
                },
                radioList: [...range(1, 7)].map(i => {
                    return {
                        key: i,
                        value: i,
                        label: weekName[i - 1]
                    }
                })
            }" />
        </template>
        <template v-else-if="model.config.type === 'list'">
            <common-form-item-checkbox :type="'common'" :custom="{
                formItem: {
                    label: '星期列表',
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
                            message: '星期列表不能为空',
                            trigger: allFormItemTrigger
                        }
                    ]
                },
                checkboxGroup: {
                    value: model.config.list,
                    onUpdateValue: (val) => { model.config.list = val.map(e => Number(e)) }
                },
                checkboxList: [...range(1, 7)].map(i => {
                    return {
                        key: i,
                        value: i,
                        label: weekName[i - 1]
                    }
                })
            }" />
        </template>
    </n-form>
</template>
<script setup lang="tsx">
import { range } from 'radash'
import { type CronWeekOptions } from './utils'
import type { DeepRequired } from 'ts-essentials'

export type Model = {
    config: DeepRequired<UnionMerge<CronWeekOptions>>
}

const weekName = ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日']

const model = reactive<Model>({
    config: {
        type: "per",
        interval: {
            start: 2,
            end: 4
        },
        week: {
            weekNo: 2,
            weekVal: 3
        },
        last: 3,
        list: []
    },
})

const formRef = useTemplateRef("form")
const typeOptions = defineSelectOptionList<Record<CronWeekOptions['type'], unknown>>({
    per: { label: '每周' },
    none: { label: '不指定' },
    interval: { label: '从星期 n 到星期 m' },
    week: { label: '第 n 周的星期 m' },
    last: { label: '最后一周的星期 n' },
    list: { label: '指定哪几个星期' }
})

defineExpose({
    formRef,
    model
})

</script>