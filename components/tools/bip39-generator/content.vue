<template>
    <tool-content :output="{
        area: {
            labelActions: [
                {
                    name: 'common-copy',
                    onClick: () => copy(result?.content || ''),
                }
            ]
        }
    }">
        <template #input>
            <n-form :model="model">
                <tool-area label="配置">
                    <n-form-item :="commonFormItemProps" path="language" label="语言">
                        <n-select :options="languageOptions" v-model:value="model.language" />
                    </n-form-item>
                    <n-form-item :="commonFormItemProps" path="type" label="类型">
                        <n-select :options="typeOptions" v-model:value="model.type"></n-select>
                    </n-form-item>
                    <n-form-item :="commonFormItemProps" path="seed" v-if="model.type === 'mnemonic'">
                        <template #label>
                            <tool-label label="种子（seed）" :actions="[
                                {
                                    name: 'common-refresh',
                                    onClick: () => refreshSeed(),
                                },
                                {
                                    name: 'common-copy',
                                    onClick: () => copy(model.seed),
                                },
                            ]" />
                        </template>
                        <n-input type="textarea" clearable v-model:value="model.seed" />
                    </n-form-item>
                    <n-form-item :="commonFormItemProps" path="mnemonic" v-if="model.type === 'seed'">
                        <template #label>
                            <tool-label label="助记符（mnemonic）" :actions="[
                                {
                                    name: 'common-refresh',
                                    onClick: () => refreshMnemonic(),
                                },
                                {
                                    name: 'common-copy',
                                    onClick: () => copy(model.mnemonic),
                                },
                            ]" />
                        </template>
                        <n-input type="textarea" clearable v-model:value="model.mnemonic" />
                    </n-form-item>
                </tool-area>
            </n-form>
        </template>
        <template #output>
            <common-rich-text :content="result?.content" />
        </template>
    </tool-content>
</template>

<script setup lang="ts">
import * as bip39 from "bip39"
import { customAlphabet } from 'nanoid';
const LanguageList = [
    "chinese_simplified",
    "chinese_traditional",
    "english",
    "japanese",
    "spanish",
    "italian",
    "french",
    "korean",
    "czech",
    "portuguese",
] as const
export type Language = typeof LanguageList[number]

const genType = [
    "mnemonic",
    "seed"
] as const

export type GenType = typeof genType[number]

export type Result = {
    content: string
}

export type Model = {
    language: Language,
    type: GenType,
    seed: string,
    mnemonic: string
}

const model = reactive<Model>({
    language: 'chinese_simplified',
    type: 'mnemonic',
    seed: '',
    mnemonic: ""
})
const getRandom = customAlphabet('1234567890abcdef');
const generateSeed = () => {
    return getRandom(32)
}

const refreshSeed = () => {
    model.seed = generateSeed();
}
const refreshMnemonic = () => {
    model.mnemonic = bip39.generateMnemonic();
}
const copy = useCopy()

const typeOptions = defineSelectOptionList<Record<string, unknown>>({
    mnemonic: { label: "种子转助记符" },
    seed: { label: "助记符转种子" },
})

watch(() => model.language, (language) => {
    bip39.setDefaultWordlist(language);
    refreshMnemonic();
})

onMounted(() => {
    refreshSeed();
    refreshMnemonic();
})
const message = useAnyMessage()
const result = computed(() => {
    let res: undefined | Result = undefined;
    try {
        const language = model.language;
        const seed = model.seed;
        const type = model.type
        const mnemonic = model.mnemonic;
        let text = ""
        bip39.setDefaultWordlist(language);
        if (type === "mnemonic" && seed) {
            text = bip39.entropyToMnemonic(seed);
        }
        if (type === "seed" && mnemonic) {
            text = bip39.mnemonicToEntropy(mnemonic);
        }
        res = {
            content: text
        }
    } catch (error) {
        message.anyError(error)
        res = undefined
    }
    return res
})

const languageOptions = defineSelectOptionList<Record<Language, unknown>>({
    chinese_simplified: { label: "简体中文" },
    chinese_traditional: { label: "繁体中文" },
    english: { label: "英语" },
    japanese: { label: "日语" },
    spanish: { label: "西班牙语" },
    italian: { label: "意大利语" },
    french: { label: "法语" },
    korean: { label: "韩语" },
    czech: { label: "捷克语" },
    portuguese: { label: "葡萄牙语" },
})
</script>