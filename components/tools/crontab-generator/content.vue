<template>
    <define-tool-wrapper>
        <template #input>
            <n-form ref="form" :model="model">
                <define-tool-area label="基础">
                    <common-form-item-radio type="common" :custom="{
                        formItem: {
                            label: '长度',
                        },
                        space: {
                            // @ts-ignore
                            class: '!flex-col'
                        },
                        radioGroup: {
                            value: model.length,
                            onUpdateValue: (val) => { model.length = val }
                        },
                        radioList: [
                            { label: '5 位，分、时、日期、月、周', value: 5 },
                            { label: '6 位，秒、分、时、日期、月、周', value: 6 },
                        ]
                    }" />
                </define-tool-area>
                <template v-if="useSeconds">
                    <define-tool-area label="秒">
                        <tools-crontab-generator-second ref="secondForm" />
                    </define-tool-area>
                </template>
                <define-tool-area label="分钟">
                    <tools-crontab-generator-minute ref="minuteForm" />
                </define-tool-area>
                <define-tool-area label="小时">
                    <tools-crontab-generator-hour ref="hourForm" />
                </define-tool-area>
                <define-tool-area label="日期">
                    <tools-crontab-generator-day ref="dayForm" />
                </define-tool-area>
                <define-tool-area label="月份">
                    <tools-crontab-generator-month ref="monthForm" />
                </define-tool-area>
                <define-tool-area label="周">
                    <tools-crontab-generator-week ref="weekForm" />
                </define-tool-area>
            </n-form>
        </template>
        <template #output>
            <common-key-value :item-label-width="100" :data="[
                { label: 'Cron 表达式', value: resRequest.data.value?.content || '' },
                { label: '是否有效', value: resRequest.data.value?.valid || '' },
                { label: '解释', value: resRequest.data.value?.expression || '' },
                { label: '下次执行时间', value: resRequest.data.value?.nextRuns?.map((item) => item.toLocaleString()).join('\n') || '' },
            ]" />
        </template>
    </define-tool-wrapper>
</template>
<script setup lang="tsx">
import { cronGenerator, type CronOptions } from './utils'
import cronValidate from "cron-validate"
import cronstrue from "cronstrue"
import 'cronstrue/locales/zh_CN';
import {Cron} from 'croner'

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

const resRequest = useCustomRequest<Result | undefined>(
    async () => {
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
            const cron = new Cron(content);
            res = {
                content,
                valid: cronResult.isValid() ? '有效' : '无效',
                expression,
                nextRuns: cron.nextRuns(10)||[]
            }
        } catch (error) {
            resRequest.mutate(undefined)
            throw error
        }
        return res;
    },
    {
        loadingKeep: 0,
        debounceOptions: {
            leading: true
        }
    }
)
watch(() => model, () => {
    resRequest.run()
}, {
    immediate: true,
    deep: true
})

</script>