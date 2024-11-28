<template>
    <tool-item-wrapper>
        <template #input>
            <n-form :model="model" require-mark-placement="left">
                <tool-item-input-fieldset>
                    <template #label>
                        文本
                    </template>
                    <n-form-item path="text" first>
                        <template #label>
                            <div class="inline-flex">
                                <span>
                                    输入
                                </span>
                            </div>
                        </template>
                        <n-input clearable placeholder="输入文本" v-model:value="model.text" type="textarea" :rows="3" />
                    </n-form-item>
                </tool-item-input-fieldset>
                <tool-item-input-fieldset>
                    <template #label>
                        配置
                    </template>
                    <n-form-item path="type" first label="转换类型">
                        <n-radio-group v-model:value="model.toType">
                            <n-space>
                                <n-radio v-for="option in toTypeOptions" :value="option.value">
                                    {{ option.label }}
                                </n-radio>
                            </n-space>
                        </n-radio-group>
                    </n-form-item>
                    <n-form-item path="type" first label="繁体类型">
                        <n-radio-group v-model:value="model.traditionalType">
                            <n-space>
                                <n-radio v-for="option in traditionalTypeOptions" :value="option.value">
                                    {{ option.label }}
                                </n-radio>
                            </n-space>
                        </n-radio-group>
                    </n-form-item>
                    <div class="custom-n-form-item">
                        <n-form-item :label-props="{ for: 'none' }">
                            <template #label>
                                <div class="flex items-center relative">
                                    <span>自定义字典</span>
                                    <div class="absolute -right-[100px]">
                                        <n-space>
                                            <n-button strong secondary circle size="tiny" @click="(e) => {
                                                model.customDictionary.push({ from: '', to: '' })
                                            }">
                                                <template #icon>
                                                    <svg-icon name="material-symbols:add"></svg-icon>
                                                </template>
                                            </n-button>
                                            <n-button strong secondary circle size="tiny" @click.capture="(e) => {
                                                const newCustomDictionary = model.customDictionary.map(e => {
                                                    return {
                                                        ...e,
                                                        from: e.to,
                                                        to: e.from
                                                    }
                                                })
                                                model.customDictionary = newCustomDictionary
                                            }">
                                                <template #icon>
                                                    <svg-icon name="bx:transfer-alt" />
                                                </template>
                                            </n-button>
                                            <n-button strong secondary circle size="tiny" @click="() => {
                                                const allDisabled = !model.customDictionary.find(e => !e.disabled);
                                                const newCustomDictionary = model.customDictionary.map(e => {
                                                    return {
                                                        ...e,
                                                        disabled: !allDisabled
                                                    }
                                                })
                                                model.customDictionary = newCustomDictionary
                                            }">
                                                <template #icon>
                                                    <svg-icon :class="{
                                                        'text-primary': !(model.customDictionary.find(e => !e.disabled))
                                                    }" name="fe:disabled" />
                                                </template>
                                            </n-button>
                                        </n-space>
                                    </div>
                                </div>
                            </template>
                            <div v-for="(item, index) in model.customDictionary"
                                class="flex w-full ml-[10px] mb-[10px] last:mb-[0px]">
                                <div class="flex w-[calc(100%-120px)]">
                                    <div class="w-[50%] mr-[5px]">
                                        <n-form-item :show-label="false" :show-feedback="false">
                                            <n-input v-model:value="item.from"></n-input>
                                        </n-form-item>
                                    </div>
                                    <svg-icon name="lets-icons:transfer-long-right" />
                                    <div class="w-[50%] ml-[5px]">
                                        <n-form-item :show-label="false" label-placement="left" :show-feedback="false">
                                            <n-input v-model:value="item.to"></n-input>
                                        </n-form-item>
                                    </div>
                                </div>
                                <div class="ml-[10px] h-[34px] flex items-center">
                                    <n-space>
                                        <n-button strong secondary circle size="tiny" @click="() => {
                                            const { from, to } = item
                                            item.from = to
                                            item.to = from
                                        }">
                                            <template #icon>
                                                <svg-icon name="bx:transfer-alt" />
                                            </template>
                                        </n-button>
                                        <n-button strong secondary circle size="tiny" @click="() => {
                                            item.disabled = !item.disabled
                                        }">
                                            <template #icon>
                                                <svg-icon :class="{
                                                    'text-primary': item.disabled
                                                }" name="fe:disabled" />
                                            </template>
                                        </n-button>
                                        <n-button strong secondary circle size="tiny"
                                            :disabled="model.customDictionary.length <= 1" @click="() => {
                                                const newCustomDictionary = model.customDictionary.filter((v, i) => {
                                                    return i !== index
                                                })
                                                model.customDictionary = newCustomDictionary
                                            }">
                                            <template #icon>
                                                <svg-icon name="material-symbols:delete" />
                                            </template>
                                        </n-button>
                                    </n-space>
                                </div>
                            </div>
                        </n-form-item>
                    </div>
                </tool-item-input-fieldset>
            </n-form>
        </template>
        <template #output>
            <div class=" whitespace-pre-wrap">
                {{ textRes }}
            </div>
        </template>
        <template #actions>
            <n-space>
                <n-button size="small" @click="handleCopy">复制</n-button>
            </n-space>
        </template>
    </tool-item-wrapper>
</template>
<script lang="ts">
export type Model = {
    text: string,
    toType: "simplified" | "traditional",
    traditionalType: "tw" | "hk" | "twp",
    customDictionary: {
        from: string,
        to: string,
        disabled?: boolean
    }[]
}
</script>
<script setup lang="ts">
import * as _OpenCC from 'opencc-js';
import copy from 'copy-to-clipboard';
const OpenCC = _OpenCC as any
defineOptions({
    toolMeta: defineToolMeta({
        title: '中文简体繁体互转',
        description: `支持中文简体繁体之间相互转换，
    - 繁体支持选择使用类型: 中国香港或中国台湾，
    - 支持自定义字典，方便覆盖一些自动转换程序没有收录到的词
`,
        category: ToolCategory.text,
        related: [
            ToolName['chinese-to-mars'],
            {
                title: "帮小忙 - 简体繁体转换",
                url: "https://tool.browser.qq.com/chinese.html"
            }
        ]
    })
})
const initialText = `悟空道：“师父又来了。怎么叫做‘水中捞月’？”
悟空道：「師父又來了。怎麼叫做『水中撈月』？」`

const model = reactive<Model>({
    text: initialText,
    toType: "traditional",
    traditionalType: "hk",
    customDictionary: [
        { from: '“', to: '「' },
        { from: '”', to: '」' },
        { from: '‘', to: '『' },
        { from: '’', to: '』' },
    ]
})
const message = useMessage()
const toTypeOptions = defineSelectOptionList<Record<Model['toType'], unknown>>({
    traditional: { label: "转繁体" },
    simplified: { label: "转简体" },
})

const traditionalTypeOptions = defineSelectOptionList<Record<Model['traditionalType'], unknown>>({
    hk: { label: " 繁体（中国香港）" },
    tw: { label: " 繁体（中国台湾）" },
    twp: { label: " 繁体（中国台湾）+ 地域短语" }
})
const textRes = computedAsync(() => {
    let from: any = undefined;
    let to: any = undefined;
    if (model.toType === "simplified") {
        to = OpenCC.Locale.to.cn
        if (model.traditionalType === "hk") {
            from = OpenCC.Locale.from.hk
        }
        if (model.traditionalType === "tw") {
            from = OpenCC.Locale.from.tw
        }
        if (model.traditionalType === "twp") {
            from = OpenCC.Locale.from.twp
        }
    }
    if (model.toType === "traditional") {
        from = OpenCC.Locale.from.cn
        if (model.traditionalType === "hk") {
            to = OpenCC.Locale.to.hk
        }
        if (model.traditionalType === "tw") {
            to = OpenCC.Locale.to.tw
        }
        if (model.traditionalType === "twp") {
            to = OpenCC.Locale.to.twp
        }
    }
    const text = model.text || "";
    const customDict = model.customDictionary.filter(e => !e.disabled).map(e => [e.from, e.to]);
    const converter = OpenCC.ConverterFactory(
        from, to.concat([customDict])
    );
    const result: string = converter(text);
    return result
})
const handleCopy = () => {
    const res = copy(textRes.value || "");
    if (res) {
        message.success("复制成功")
    } else {
        message.error("复制失败")
    }
}

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