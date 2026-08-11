<template>
    <n-form ref="form" :model="model">
        <n-form-item :="commonFormItemProps" path="config.type" label="类型">
            <n-select :options="typeOptions" v-model:value="model.config.type" />
        </n-form-item>
        <template v-if="model.config.type === 'interval'">
            <n-form-item :="commonFormItemProps" path="config.interval.start" label="从星期 n 开始" :rule="[
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
            ]">
                <n-radio-group v-model:value="model.config.interval.start">
                    <n-space>
                        <template v-for="i in range(1, 7)">
                            <n-radio :="{
                                key: i,
                                value: i,
                                label: weekName[i - 1]
                            }" />
                        </template>
                    </n-space>
                </n-radio-group>
            </n-form-item>
            <n-form-item :="commonFormItemProps" path="config.interval.end" label="到星期 m 结束" :rule="[
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
            ]">
                <n-radio-group v-model:value="model.config.interval.end">
                    <n-space>
                        <template v-for="i in range(1, 7)">
                            <n-radio :="{
                                key: i,
                                value: i,
                                label: weekName[i - 1]
                            }" />
                        </template>
                    </n-space>
                </n-radio-group>
            </n-form-item>
        </template>
        <template v-else-if="model.config.type === 'week'">
            <n-form-item :="commonFormItemProps" path="config.week.weekNo" label="第 n 周">
                <n-radio-group v-model:value="model.config.week.weekNo">
                    <n-space>
                        <template v-for="i in range(1, 5)">
                            <n-radio :="{
                                key: i,
                                value: i,
                                label: '第' + i.toString() + '周'
                            }" />
                        </template>
                    </n-space>
                </n-radio-group>
            </n-form-item>
            <n-form-item :="commonFormItemProps" path="config.week.weekVal" label="星期 m">
                <n-radio-group v-model:value="model.config.week.weekVal">
                    <n-space>
                        <template v-for="i in range(1, 7)">
                            <n-radio :="{
                                key: i,
                                value: i,
                                label: weekName[i - 1]
                            }" />
                        </template>
                    </n-space>
                </n-radio-group>
            </n-form-item>
        </template>
        <template v-else-if="model.config.type === 'last'">
            <n-form-item :="commonFormItemProps" path="config.last" label="星期 n">
                <n-radio-group v-model:value="model.config.last">
                    <n-space>
                        <template v-for="i in range(1, 7)">
                            <n-radio :="{
                                key: i,
                                value: i,
                                label: weekName[i - 1]
                            }" />
                        </template>
                    </n-space>
                </n-radio-group>
            </n-form-item>
        </template>
        <template v-else-if="model.config.type === 'list'">
            <n-form-item :="commonFormItemProps" path="config.list" label="星期列表" :rule="[
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
            ]">
                <n-checkbox-group v-model:value="model.config.list">
                    <n-space>
                        <template v-for="i in range(1, 7)">
                            <n-checkbox :="{
                                key: i,
                                value: i,
                                label: weekName[i - 1]
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