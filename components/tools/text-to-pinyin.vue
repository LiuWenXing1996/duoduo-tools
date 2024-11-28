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
                        <n-input clearable placeholder="输入文本" v-model:value="model.text" type="textarea" :rows="2" />
                    </n-form-item>
                </tool-item-input-fieldset>
                <tool-item-input-fieldset>
                    <template #label>
                        配置
                    </template>
                    <n-form-item path="pattern" first label="结果形式">
                        <n-select v-model:value="model.pattern" :options="patternOptions" />
                    </n-form-item>
                    <n-form-item path="toneType" first label="音调输出形式">
                        <n-select v-model:value="model.toneType" :options="toneTypeOptions" />
                    </n-form-item>
                    <n-form-item path="v" first label="ü转v(带音调的ǖ,ǘ,ǚ,ǜ不会被换)">
                        <n-switch v-model:value="model.v" />
                    </n-form-item>
                    <n-form-item path="surname" first label="姓氏模式">
                        <n-select v-model:value="model.surname" :options="surnameOptions" />
                    </n-form-item>
                    <n-form-item path="toneSandhi" first label="一字和不字智能变调">
                        <n-switch v-model:value="model.toneSandhi" />
                    </n-form-item>
                    <n-form-item path="separator" first label="输出分隔符">
                        <n-input v-model:value="model.separator" />
                    </n-form-item>
                    <n-form-item path="nonZhOptions" first label="非汉字字符处理">
                        <n-select v-model:value="model.nonZh" :options="nonZhOptions" />
                    </n-form-item>
                    <n-form-item path="segmentit" first label="分词算法">
                        <n-select v-model:value="model.segmentit" :options="segmentitOptions" />
                    </n-form-item>
                </tool-item-input-fieldset>
            </n-form>
        </template>
        <template #output>
            <div>
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
    toneType: "none" | "symbol" | "num"
    pattern: "pinyin" | "initial" | "final" | 'finalHead' | "finalBody" | 'finalTail' | 'num' | 'first',
    surname: "off" | 'head' | 'all',
    separator: string,
    nonZh: "spaced" | "removed" | "consecutive",
    v: boolean,
    toneSandhi: boolean
    segmentit: "1" | "2" | "3"
}
</script>
<script setup lang="ts">
import { pinyin } from 'pinyin-pro';
import copy from 'copy-to-clipboard';

defineOptions({
    toolMeta: defineToolMeta({
        title: '文字转拼音',
        description: "将输入的文本转为汉语拼音，支持各种配置",
        category: ToolCategory.text,
        related: [
            {
                title: "帮小忙 - 文字转拼音",
                url: "https://tool.browser.qq.com/tta.html"
            }
        ]
    })
})

const message = useMessage()
const initialText = `我是一名粉刷匠`
const model = reactive<Model>({
    text: initialText,
    toneType: 'symbol',
    pattern: 'pinyin',
    surname: 'off',
    separator: ' ',
    nonZh: 'spaced',
    v: false,
    toneSandhi: false,
    segmentit: "2"
})

const toneTypeOptions = defineSelectOptionList<Record<Model["toneType"], unknown>>({
    symbol: { label: "作为音调符号带在拼音字母上" },
    num: { label: "作为数字跟在拼音后" },
    none: { label: "不加音调" },
})
const patternOptions = defineSelectOptionList<Record<Model["pattern"], unknown>>({
    pinyin: { label: "拼音全拼" },
    first: { label: "拼音首字母" },
    initial: { label: "声母" },
    final: { label: "韵母" },
    finalHead: { label: "韵头（介音）" },
    finalBody: { label: "韵腹" },
    finalTail: { label: "韵尾" },
    num: { label: "音调对应数字(轻声为 0)" },
})

const surnameOptions = defineSelectOptionList<Record<Model["surname"], unknown>>({
    off: { label: "不启用" },
    head: { label: "识别开头的姓氏" },
    all: { label: "识别全部的姓氏" },
})

const nonZhOptions = defineSelectOptionList<Record<Model["nonZh"], unknown>>({
    spaced: { label: "分隔" },
    consecutive: { label: "紧凑" },
    removed: { label: "移除" },
})

const segmentitOptions = defineSelectOptionList<Record<Model['segmentit'], unknown>>({
    "1": { label: "逆向最大匹配算法(速度最快)" },
    "2": { label: "最大概率算法(识别最准确)" },
    "3": { label: "最少分词数算法" }
})


const textRes = computed(() => {
    const res = pinyin(model.text, {
        toneType: model.toneType,
        pattern: model.pattern,
        surname: model.surname,
        separator: model.separator,
        nonZh: model.nonZh,
        v: model.v,
        toneSandhi: model.toneSandhi,
        segmentit: Number(model.segmentit)
    })
    return res
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