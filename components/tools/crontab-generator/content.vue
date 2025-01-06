<template>
    <tool-content>
        <template #input>
            <n-form ref="form" :model="model">
                <tool-area label="基础">
                    <n-form-item :="commonFormItemProps" path="length" label="长度">
                        <n-radio-group v-model:value="model.length">
                            <n-space class="!flex-col">
                                <n-radio :value="5">5 位，分、时、日期、月、周</n-radio>
                                <n-radio :value="6">6 位，秒、分、时、日期、月、周</n-radio>
                            </n-space>
                        </n-radio-group>
                    </n-form-item>
                </tool-area>
                <template v-if="useSeconds">
                    <tool-area label="秒">
                        <tools-crontab-generator-second ref="secondForm" />
                    </tool-area>
                </template>
                <tool-area label="分钟">
                    <tools-crontab-generator-minute ref="minuteForm" />
                </tool-area>
                <tool-area label="小时">
                    <tools-crontab-generator-hour ref="hourForm" />
                </tool-area>
                <tool-area label="日期">
                    <tools-crontab-generator-day ref="dayForm" />
                </tool-area>
                <tool-area label="月份">
                    <tools-crontab-generator-month ref="monthForm" />
                </tool-area>
                <tool-area label="周">
                    <tools-crontab-generator-week ref="weekForm" />
                </tool-area>
            </n-form>
        </template>
        <template #output>
            <key-value :item-label-width="100" :data="[
                {
                    label: 'Cron 表达式', value: result?.content || '', valueActions: [
                        {
                            name: 'common-copy',
                            onClick: () => {
                                copy(result?.content || '')
                            }
                        }
                    ]
                },
                { label: '是否有效', value: result?.valid || '' },
                { label: '解释', value: result?.expression || '' },
                { label: '下次执行时间', value: result?.nextRuns?.map((item) => item.toLocaleString()).join('\n') || '' },
            ]" />
        </template>
    </tool-content>
</template>
<script setup lang="tsx">
import { cronGenerator, type CronOptions } from './utils'
import cronValidate from "cron-validate"
import cronstrue from "cronstrue"
import 'cronstrue/locales/zh_CN';
import { CronosExpression } from 'cronosjs'

export type Model = {
    config: {
        second?: ToolsCrontabGeneratorSecondComponentModel,
        minute?: ToolsCrontabGeneratorMinuteComponentModel,
        hour?: ToolsCrontabGeneratorHourComponentModel,
        day?: ToolsCrontabGeneratorDayComponentModel,
        month?: ToolsCrontabGeneratorMonthComponentModel,
        week?: ToolsCrontabGeneratorWeekComponentModel,
    },
    length: number,
}

export type Result = {
    content: string,
    valid: string,
    expression: string,
    nextRuns?: Date[]
}
const model = reactive<Model>({
    config: {},
    length: 5
})
const copy = useCopy();
const formRef = useTemplateRef("form")

const secondFormRef = useTemplateRef('secondForm');
watch(() => secondFormRef.value?.model, (val) => {
    model.config.second = val
})

const minuteFormRef = useTemplateRef('minuteForm');
watch(() => minuteFormRef.value?.model, (val) => {
    model.config.minute = val
})

const hourFormRef = useTemplateRef('hourForm');
watch(() => hourFormRef.value?.model, (val) => {
    model.config.hour = val
})

const dayFormRef = useTemplateRef('dayForm');
watch(() => dayFormRef.value?.model, (val) => {
    model.config.day = val
})

const monthFormRef = useTemplateRef('monthForm');
watch(() => monthFormRef.value?.model, (val) => {
    model.config.month = val
})

const weekFormRef = useTemplateRef('weekForm');
watch(() => weekFormRef.value?.model, (val) => {
    model.config.week = val
})

const useSeconds = computed(() => model.length >= 6)
const useYears = computed(() => model.length >= 7)
const message = useAnyMessage()

const changedTag = useChangeTag(() => model, {
    immediate: true,
    deep: true
})
const result = computedAsync(async () => {
    changedTag.registerChange()
    let res: Result | undefined = undefined;
    try {
        await formRef.value?.validate();
        if (useSeconds.value) {
            await secondFormRef.value?.formRef?.validate();
        }
        await minuteFormRef.value?.formRef?.validate();
        await hourFormRef.value?.formRef?.validate();
        await dayFormRef.value?.formRef?.validate();
        await monthFormRef.value?.formRef?.validate();
        await weekFormRef.value?.formRef?.validate();
        const options: CronOptions = {
            second: model.config.second?.config,
            minute: model.config.minute!.config,
            hour: model.config.hour!.config,
            day: model.config.day!.config,
            month: model.config.month!.config,
            week: model.config.week!.config,
        }
        const content = cronGenerator(options, {
            length: model.length
        });
        const cronResult = cronValidate(content, {
            preset: 'default',
            override: {
                useSeconds: useSeconds.value,
                useYears: useYears.value,
                useBlankDay: true,
                useLastDayOfMonth: true,
                useLastDayOfWeek: true,
                useNearestWeekday: true,
                useNthWeekdayOfMonth: true,
            }
        });
        const expression = cronstrue.toString(content, {
            locale: 'zh_CN',
            use24HourTimeFormat: true
        });
        const dateList = CronosExpression.parse(content).nextNDates(
            new Date(), 10)
        res = {
            content,
            valid: cronResult.isValid() ? '有效' : '无效',
            expression,
            // nextRuns: cron.nextRuns(10) || []
            nextRuns: dateList
        }
    } catch (error) {
        message.anyError(error)
        res = undefined
    }
    return res;
})

</script>