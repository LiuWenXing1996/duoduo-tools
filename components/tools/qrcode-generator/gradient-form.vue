<template>
    <n-form ref="formRef" :model="model" :rules="rules" require-mark-placement="left">
        <n-form-item path="gradient.type" first label="渐变类型">
            <n-radio-group v-model:value="model.type">
                <n-space>
                    <n-radio value="linear"> 线性 </n-radio>
                    <n-radio value="radial"> 径向 </n-radio>
                </n-space>
            </n-radio-group>
        </n-form-item>
        <div class="custom-n-form-item">
            <n-form-item :label-props="{ for: 'none' }">
                <template #label>
                    <div class="flex items-center relative">
                        <span>渐变颜色列表</span>
                        <div class="absolute -right-[30px]">
                            <n-button strong secondary circle size="tiny" @click="(e) => {
                                model.colorStops.push({
                                    offset: 100,
                                    color: '#000'
                                })
                            }">
                                <template #icon>
                                    <svg-icon name="material-symbols:add"></svg-icon>
                                </template>
                            </n-button>
                        </div>
                    </div>
                </template>
                <div v-for="(item, index) in model.colorStops" class="flex w-full ml-[10px] mb-[10px] last:mb-[0px]">
                    <div class="flex w-[calc(100%-40px)]">
                        <div class="w-[50%] mr-[5px]">
                            <n-form-item label="颜色" :show-label="true" label-placement="left" :label-style="{
                                alignItems: 'center'
                            }" :show-feedback="false" :path="`gradient.colorStops[${index}].color`">
                                <n-color-picker v-model:value="item.color" :render-label="() => ''" />
                            </n-form-item>
                        </div>
                        <div class="w-[50%] ml-[5px]">
                            <n-form-item label="位置" :show-label="true" label-placement="left" :label-style="{
                                alignItems: 'center'
                            }" :show-feedback="false" :path="`gradient.colorStops[${index}].offset`">
                                <!-- FIXME:移动端时这个地方的输入框被挡住了 -->
                                <n-input-number v-model:value="item.offset" :min="0" :max="100" class="w-full">
                                    <template #suffix>
                                        %
                                    </template>
                                </n-input-number>
                            </n-form-item>
                        </div>
                    </div>
                    <div class="ml-[10px] h-[34px] flex items-center">
                        <n-button strong secondary circle size="tiny" :disabled="model.colorStops.length <= 1" @click="() => {
                            const newColorStops = model.colorStops.filter((v, i) => {
                                return i !== index
                            })
                            model.colorStops = newColorStops
                        }">
                            <template #icon>
                                <svg-icon name="material-symbols:delete" />
                            </template>
                        </n-button>
                    </div>
                </div>
            </n-form-item>
        </div>
        <n-form-item path="gradient.rotation" first label="旋转角度">
            <n-input-number v-model:value="model.rotation" :min="0" :max="360" :step="30">
                <template #suffix>
                    度
                </template>
            </n-input-number>
        </n-form-item>
    </n-form>
</template>
<script lang="ts">
export type Model = Gradient
</script>
<script setup lang="ts">
import type { FormInst, FormRules } from 'naive-ui';
import type { Gradient } from 'qr-code-styling';

const formRef = ref<FormInst | null>(null)

const model = reactive<Model>({
    type: "linear",
    rotation: 0,
    colorStops: [
        {
            offset: 0,
            color: "#000"
        },
        {
            offset: 100,
            color: "#fff"
        }
    ]
})
const rules: FormRules = {}
defineExpose({
    formRef,
    model
})
</script>


<style lang="less" scoped>
.custom-n-form-item {
    :deep(> .n-form-item) {
        >.n-form-item-blank {
            display: flex;
            flex-direction: column;
        }
    }
}
</style>