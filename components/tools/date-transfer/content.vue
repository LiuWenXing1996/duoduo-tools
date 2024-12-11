<template>
    <define-tool-wrapper>
        <template #input>
            <n-form ref="formRef" :model="model" :rules="rules">
                <define-tool-area label="输入">
                    <n-form-item path="dateType" label="日期类型" first>
                        <n-select :options="dataTypeOptions" v-model:value="model.dateType" />
                    </n-form-item>
                    <n-form-item path="text" label="日期" first>
                        <n-input clearable placeholder="输入日期" v-model:value="model.text" />
                    </n-form-item>
                </define-tool-area>
            </n-form>
        </template>
        <template #output>
            <n-descriptions label-placement="left" :column="1" label-class="w-[130px] inline-flex"
                content-class="w-[calc(100%-130px)]">
                <n-descriptions-item v-for="text in textRes">
                    <template #label>
                        <div class="inline-flex">
                            <span class="font-medium break-all">
                                {{ text.label }}
                            </span>
                        </div>
                    </template>
                    <div class="inline-flex" v-if="text.result">
                        <span class=" break-all">
                            {{ text.result }}
                            <n-tooltip trigger="hover">
                                <template #trigger>
                                    <div class=" inline-flex">
                                        <svg-icon class="ml-[2px] pb-[5px] text-[12px] cursor-pointer"
                                            name="common-copy" @click="copy(text.result)" />
                                    </div>
                                </template>
                                {{ `点击复制` }}
                            </n-tooltip>
                        </span>

                    </div>
                </n-descriptions-item>
            </n-descriptions>
        </template>
    </define-tool-wrapper>
</template>
<script setup lang="ts">
import type { FormRules, SelectOption } from 'naive-ui';
import { methods, DateType } from './utils';

export type Model = {
    dateType: DateType,
    text: string
}

const copy = useCopy()
const model = reactive<Model>({
    dateType: DateType['ISO-8601'],
    text: ""
})
const form = useTemplateRef("formRef")
onMounted(() => {
    const now = new Date()
    model.text = methods[model.dateType].to(now)
})

const dataTypeOptions: SelectOption[] = Object.entries(methods).map(([key, value]) => {
    return {
        key,
        label: value.label,
        value: key,
    }
})

watch(() => model.dateType, () => {
    try {
        form?.value?.validate()
    } catch (error) {
    }
})

const rules: FormRules = {
    text: [
        { required: true, message: '请输入日期', trigger: ['input', 'change', 'blur', 'focus'] },
        {
            validator: (rule, value) => {
                let res = false;
                try {
                    res = methods[model.dateType].validate(value)
                } catch (error) {
                    res = false
                }
                return res
            }, message: '无效的日期类型', trigger: ['input', 'change', 'blur', 'focus']
        }
    ],
}

const textRes = computed(() => {
    const text = model.text || "";
    const dateType = model.dateType;
    let dateInstance: undefined | Date = undefined;
    try {
        const m = methods[dateType]
        const isValid = m.validate(text);
        if (isValid) {
            dateInstance = m.form(text)
        }
    } catch (error) {
    }

    return Object.values(methods).map(m => {
        let res = "";
        try {
            if (dateInstance) {
                res = m.to(dateInstance)
            }
        } catch (error) {

        }
        return {
            ...m,
            result: res
        }
    })
})
</script>