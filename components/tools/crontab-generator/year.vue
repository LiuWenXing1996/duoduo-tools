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
                    label: '从 n 年开始(>=1970)',
                    path: 'config.interval.start',
                    rule: [
                        {
                            validator: (_, val) => {
                                if (val < 1970) {
                                    return false
                                }
                            },
                            message: '开始年不能小于 1970',
                            trigger: allFormItemTrigger
                        },
                        {
                            validator: (_, val) => {
                                if (val > 2099) {
                                    return false
                                }
                            },
                            message: '开始年不能大于 2099',
                            trigger: allFormItemTrigger
                        },
                        {
                            validator: (_, val) => {
                                if (val > model.config.interval.end) {
                                    return false
                                }
                            },
                            message: '开始年不能大于结束年',
                            trigger: allFormItemTrigger
                        }
                    ]
                },
                inputNumber: {
                    min: 1970,
                    max: 2099,
                    value: model.config.interval.start,
                    onUpdateValue: (val) => { model.config.interval.start = val ?? 0 }
                }
            }" />
            <common-form-item-input-number :type="'common'" :custom="{
                formItem: {
                    label: '到 m 年结束(<=2099)',
                    path: 'config.interval.end',
                    rule: [
                        {
                            validator: (_, val) => {
                                if (val < 1970) {
                                    return false
                                }
                            },
                            message: '结束年不能小于 1970',
                            trigger: allFormItemTrigger
                        },
                        {
                            validator: (_, val) => {
                                if (val > 2099) {
                                    return false
                                }
                            },
                            message: '结束年不能大于 2099',
                            trigger: allFormItemTrigger
                        },
                        {
                            validator: (_, val) => {
                                if (val < model.config.interval.start) {
                                    return false
                                }
                            },
                            message: '结束年不能小于开始年',
                            trigger: allFormItemTrigger
                        }
                    ]
                },
                inputNumber: {
                    min: 1970,
                    max: 2099,
                    value: model.config.interval.end,
                    onUpdateValue: (val) => { model.config.interval.end = val ?? 0 }
                }
            }" />
        </template>
    </n-form>
</template>
<script setup lang="tsx">
import type { DeepRequired } from 'ts-essentials'
import { type CronYearOptions } from './utils'

export type Model = {
    config: DeepRequired<UnionMerge<CronYearOptions>>
}

const model = reactive<Model>({
    config: {
        type: "per",
        interval: {
            start: 1970,
            end: 2099
        },
    },
})

const formRef = useTemplateRef("form")
const typeOptions = defineSelectOptionList<Record<CronYearOptions['type'], unknown>>({
    per: { label: '每年' },
    none: { label: '不指定' },
    interval: { label: '从 n 年 到 m 年' },
})

defineExpose({
    formRef,
    model
})

</script>