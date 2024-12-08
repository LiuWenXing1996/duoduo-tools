<template>
    <define-tool-wrapper>
        <template #input>
            <n-form :model="model">
                <define-tool-area label="基础">
                    <n-form-item path="language" first label="语言">
                        <n-select :options="languageOptions" v-model:value="model.language" />
                    </n-form-item>
                    <n-form-item path="type" first label="类型">
                        <n-select :options="typeOptions" v-model:value="model.type"></n-select>
                    </n-form-item>
                    <n-form-item path="seed" first :label-props="{ for: 'none' }"
                        v-if="model.type === GenType.mnemonic">
                        <template #label>
                            <div class="flex items-center relative">
                                <span>
                                    种子（seed）
                                </span>
                                <div class="absolute -right-[60px]">
                                    <n-space>
                                        <n-button strong secondary circle size="tiny" @click="refreshSeed">
                                            <template #icon>
                                                <svg-icon name="common-refresh"></svg-icon>
                                            </template>
                                        </n-button>
                                        <n-button strong secondary circle size="tiny" @click="copySeed">
                                            <template #icon>
                                                <svg-icon name="common-copy"></svg-icon>
                                            </template>
                                        </n-button>
                                    </n-space>
                                </div>
                            </div>
                        </template>
                        <n-input v-model:value="model.seed" />
                    </n-form-item>
                    <n-form-item path="mnemonic" first :label-props="{ for: 'none' }"
                        v-if="model.type === GenType.seed">
                        <template #label>
                            <div class="flex items-center relative">
                                <span>
                                    助记符（mnemonic）
                                </span>
                                <div class="absolute -right-[60px]">
                                    <n-space>
                                        <n-button strong secondary circle size="tiny" @click="refreshMnemonic">
                                            <template #icon>
                                                <svg-icon name="common-refresh"></svg-icon>
                                            </template>
                                        </n-button>
                                        <n-button strong secondary circle size="tiny" @click="copyMnemonic">
                                            <template #icon>
                                                <svg-icon name="common-copy"></svg-icon>
                                            </template>
                                        </n-button>
                                    </n-space>
                                </div>
                            </div>
                        </template>
                        <n-input v-model:value="model.mnemonic" />
                    </n-form-item>
                </define-tool-area>
            </n-form>
        </template>
        <template #output>
            <div class=" break-all">
                {{ res }}
            </div>
        </template>
        <template #actions>
            <n-space>
                <n-button size="small" @click="handleCopy">复制</n-button>
            </n-space>
        </template>
    </define-tool-wrapper>
</template>

<script setup lang="ts">
import * as bip39 from "bip39"
import { customAlphabet } from 'nanoid';
import copy from 'copy-to-clipboard';
enum Language {
    "chinese_simplified" = "chinese_simplified",
    "chinese_traditional" = "chinese_traditional",
    "english" = "english",
    "japanese" = "japanese",
    "spanish" = "spanish",
    "italian" = "italian",
    "french" = "french",
    "korean" = "korean",
    "czech" = "czech",
    "portuguese" = "portuguese",
}

enum GenType {
    mnemonic = "mnemonic",
    seed = "seed"
}

export type Model = {
    language: Language,
    type: GenType,
    seed: string,
    mnemonic: string
}

const model = reactive<Model>({
    language: Language.chinese_simplified,
    type: GenType.mnemonic,
    seed: '',
    mnemonic: ""
})
const message = useMessage();
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
const copySeed = () => {
    const res = copy(model.seed || "");
    if (res) {
        message.success("复制成功")
    } else {
        message.error("复制失败")
    }
}

const copyMnemonic = () => {
    const res = copy(model.mnemonic || "");
    if (res) {
        message.success("复制成功")
    } else {
        message.error("复制失败")
    }
}

const typeOptions = defineSelectOptionList<Record<GenType, unknown>>({
    [GenType.mnemonic]: { label: "种子转助记符" },
    [GenType.seed]: { label: "助记符转种子" },
})

watch(() => model.language, (language) => {
    bip39.setDefaultWordlist(language);
    refreshMnemonic();
})

onMounted(() => {
    refreshSeed();
    refreshMnemonic();
})

const res = computed(() => {
    const language = model.language;
    const seed = model.seed;
    const type = model.type
    const mnemonic = model.mnemonic;
    let text = ""
    bip39.setDefaultWordlist(language);
    try {
        if (type === GenType.mnemonic) {
            text = bip39.entropyToMnemonic(seed);
        }
        if (type === GenType.seed) {
            text = bip39.mnemonicToEntropy(mnemonic);
        }
    } catch (error) {
        console.log(error)
        text = ""
    }
    return text
})

const handleCopy = () => {
    const cpyRes = copy(res.value || "");
    if (cpyRes) {
        message.success("复制成功")
    } else {
        message.error("复制失败")
    }
}


const languageOptions = defineSelectOptionList<Record<Language, unknown>>({
    [Language["chinese_simplified"]]: { label: "简体中文" },
    [Language["chinese_traditional"]]: { label: "繁体中文" },
    [Language["english"]]: { label: "英语" },
    [Language["japanese"]]: { label: "日语" },
    [Language["spanish"]]: { label: "西班牙语" },
    [Language["italian"]]: { label: "意大利语" },
    [Language["french"]]: { label: "法语" },
    [Language["korean"]]: { label: "韩语" },
    [Language["czech"]]: { label: "捷克语" },
    [Language["portuguese"]]: { label: "葡萄牙语" },
})


</script>