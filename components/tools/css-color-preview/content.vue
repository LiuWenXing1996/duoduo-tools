<template>
    <tool-wrapper>
        <template #input>
            <n-form ref="form" :model="model">
                <tool-area label="颜色">
                    <n-form-item :="commonFormItemProps" path="color" :rule="[
                        {
                            required: true,
                            message: '请输入色值',
                            trigger: ['input', 'change', 'blur', 'focus']
                        },
                        {
                            validator: (_rule, value: string) => {
                                return isValidColor(value)
                            },
                            message: '请输入合法色值',
                            trigger: ['input', 'change', 'blur', 'focus']
                        }
                    ]">
                        <template #label>
                            <tool-label label="输入" :actions="[
                                {
                                    name: 'common-demo',
                                    onClick: () => {
                                        model.color = initialColor
                                    }
                                }
                            ]" />
                        </template>
                        <n-input clearable placeholder="输入合法色值" v-model:value="model.color" />
                    </n-form-item>
                </tool-area>
            </n-form>
        </template>
        <template #output>
            <template v-if="result?.color">
                <div class="h-[30px] w-[30px]" :style="{
                    backgroundColor: result.color
                }"></div>
            </template>
            <template v-else>
                <n-empty description="无效色值" />
            </template>
        </template>
    </tool-wrapper>
</template>
<script setup lang="ts">

export type Model = {
    color: string
}

export type Result = {
    color: string
}

const initialColor = 'red'
const model = reactive<Model>({
    color: initialColor
})
const formRef = useTemplateRef("form");
const message = useAnyMessage()
const result = computedAsync(
    async () => {
        let res: undefined | Result = undefined;
        const color = model.color;
        try {
            await formRef.value?.validate();
            res = {
                color
            }
        } catch (error) {
            message.anyError(error)
            res = undefined;
        }
        return res
    }
)
const isValidColor = (color: string) => {
    let otpNode = new Option();
    otpNode.style.color = color
    return !!otpNode.style.color
}
</script>