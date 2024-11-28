<template>
    <tool-item-wrapper>
        <template #input>
            <n-form ref="formRef" :model="model" :rules="rules" require-mark-placement="left">
                <tool-item-input-fieldset>
                    <template #label>
                        内容
                    </template>
                    <n-form-item path="data" first label="文本">
                        <n-input clearable placeholder="输入内容" v-model:value="model.data" type="textarea" :rows="3" />
                    </n-form-item>
                    <n-form-item path="width" first label="宽度">
                        <n-input-number v-model:value="model.width" :min="1" :step="50">
                            <template #suffix>
                                像素
                            </template>
                        </n-input-number>
                    </n-form-item>
                    <n-form-item path="height" first label="高度">
                        <n-input-number v-model:value="model.height" :min="1" :step="50">
                            <template #suffix>
                                像素
                            </template>
                        </n-input-number>
                    </n-form-item>
                    <n-form-item path="margin" first label="边距">
                        <n-input-number v-model:value="model.margin" :min="0" :step="10">
                            <template #suffix>
                                像素
                            </template>
                        </n-input-number>
                    </n-form-item>
                    <n-form-item path="errorCorrectionLevel" first label="纠错级别">
                        <n-select v-model:value="model.errorCorrectionLevel" :options="errorCorrectionLevelOptions" />
                    </n-form-item>
                </tool-item-input-fieldset>
                <tool-item-input-fieldset>
                    <template #label>
                        图标
                    </template>
                    <tools-qrcode-generator-logo-options-form ref="logoOptions" />
                </tool-item-input-fieldset>
                <tool-item-input-fieldset>
                    <template #label>
                        背景
                    </template>
                    <tools-qrcode-generator-background-options-form ref="backgroundOptions" />
                </tool-item-input-fieldset>
                <tool-item-input-fieldset>
                    <template #label>
                        信息点
                    </template>
                    <tools-qrcode-generator-dots-options-form ref="dotsOptions" />
                </tool-item-input-fieldset>
                <tool-item-input-fieldset>
                    <template #label>
                        定位点
                    </template>
                    <tools-qrcode-generator-corners-options-form ref="cornersOptions" />
                </tool-item-input-fieldset>
                <tool-item-input-fieldset>
                    <template #label>
                        定位点边框
                    </template>
                    <tools-qrcode-generator-corners-square-options-form ref="cornersSquareOptions" />
                </tool-item-input-fieldset>
            </n-form>
        </template>
        <template #output>
            <div v-show="isShowScale.content.value" class="absolute top-0 right-[10px] z-10">
                <n-tag>放缩比: {{ scale.toFixed(1) }}</n-tag>
            </div>
            <div :style="{ zoom: scale }">
                <div ref="qrCodeRef"></div>
            </div>
        </template>
        <template #actions>
            <n-space>
                <n-dropdown trigger="click" :options="downloadFileTypeOptions" @select="handleDownload">
                    <n-button size="small">
                        下载二维码
                    </n-button>
                </n-dropdown>
                <n-button size="small" @click="scaleAdd">放大</n-button>
                <n-button size="small" @click="scaleSub">缩小</n-button>
            </n-space>
        </template>
    </tool-item-wrapper>
</template>
<script setup lang="ts">
import type { FormInst, FormRules } from 'naive-ui';
import QRCodeStyling, { type ErrorCorrectionLevel, type FileExtension, type Gradient, type Options } from 'qr-code-styling';
import type { Model as DotsOptionsFormModel } from "./dots-options-form.vue"
import type { Model as CornersOptionsFormModel } from "./corners-options-form.vue"
import type { Model as CornersSquareOptionsFormModel } from "./corners-square-options-form.vue"
import type { Model as ColorFormModel } from "./color-form.vue"
import type { Model as BackgroundOptionsFormModel } from "./background-options-form.vue"
import type { Model as LogoOptionsFormModel } from "./logo-options-form.vue"

defineOptions({
    toolMeta: defineToolMeta({
        title: '二维码生成',
        description: "将文字转成二维码，支持添加图标，自定义颜色，码点形状等",
        category: ToolCategory.picture,
        related: [
            {
                title: "QR Code Styling",
                url: "https://qr-code-styling.com/"
            },
            {
                title: "帮小忙 - 二维码美化",
                url: "https://tool.browser.qq.com/prettify_qrcode.html"
            },
        ]
    })
})
const isShowScale = useAutoBoolean()
const scale = ref(1)
const scaleAdd = () => {
    scale.value = scale.value + 0.1;
    isShowScale.toggle();
}

const scaleSub = () => {
    const newVal = scale.value - 0.1;
    if (newVal <= 0.1) {
        scale.value = 0.1
    } else {
        scale.value = newVal
    }
    isShowScale.toggle();
}
const initialText = '二维码生成';
const dotsOptionsRef = useTemplateRef('dotsOptions');
const cornersOptionsRef = useTemplateRef('cornersOptions');
const cornersSquareOptionsRef = useTemplateRef('cornersSquareOptions');
const backgroundOptionsRef = useTemplateRef('backgroundOptions');
const logoOptionsRef = useTemplateRef('logoOptions');
watch(() => logoOptionsRef.value?.model, (val) => {
    model.logoOptions = val
})

watch(() => dotsOptionsRef.value?.model, (val) => {
    model.dotsOptions = val
})
watch(() => cornersOptionsRef.value?.model, (val) => {
    model.cornersOptions = val
})
watch(() => cornersSquareOptionsRef.value?.model, (val) => {
    model.cornersSquareOptions = val
})
watch(() => backgroundOptionsRef.value?.model, (val) => {
    model.backgroundOptions = val
})

type Model = Pick<Options, "data" | "image" | "width" | "height" | "margin"> & {
    errorCorrectionLevel: ErrorCorrectionLevel,
    logoOptions: LogoOptionsFormModel | undefined,
    backgroundOptions: BackgroundOptionsFormModel | undefined,
    dotsOptions: DotsOptionsFormModel | undefined,
    cornersOptions: CornersOptionsFormModel | undefined,
    cornersSquareOptions: CornersSquareOptionsFormModel | undefined,
}

const modelToQrcodeOptions = (model: Model): Options => {
    const utf8_encode = function (s: string) {
        return unescape(encodeURIComponent(s));
    };

    const transformColor = (color: ColorFormModel | undefined): {
        color?: string;
        gradient?: Gradient;
    } => {
        return {
            color: color?.type === "single" ? color.content.single : undefined,
            gradient: color?.type === "gradient" ? {
                type: color.content.gradient?.type || 'linear',
                rotation: (color?.content?.gradient?.rotation || 0) * (Math.PI / 180),
                colorStops: (color?.content?.gradient?.colorStops || []).map(e => {
                    return {
                        ...e,
                        offset: e.offset / 100
                    }
                })
            } : undefined
        }
    }

    return {
        data: utf8_encode(model.data || ""),
        image: model.logoOptions?.image,
        height: model.height,
        width: model.width,
        margin: model.margin,
        qrOptions: {
            errorCorrectionLevel: model.errorCorrectionLevel
        },
        imageOptions: {
            imageSize: model.logoOptions?.size ? model.logoOptions?.size / 100 : undefined,
            margin: model.logoOptions?.margin,
            hideBackgroundDots: model.logoOptions?.hideBackgroundDots,
        },
        backgroundOptions: {
            round: model.backgroundOptions?.round ? (model.backgroundOptions?.round / 100) : undefined,
            ...(model.backgroundOptions?.color?.isCustom
                ? transformColor(model.backgroundOptions?.color?.content)
                : {
                    color: "#fff",
                    gradient: undefined
                })
        },
        dotsOptions: {
            type: model.dotsOptions?.type,
            ...transformColor(model.dotsOptions?.color)
        },
        cornersDotOptions: {
            type: model.cornersOptions?.type === "none" ? undefined : model.cornersOptions?.type,
            ...(model.cornersOptions?.color?.isCustom
                ? transformColor(model.cornersOptions?.color?.content)
                : {
                    color: undefined,
                    gradient: undefined
                })
        },
        cornersSquareOptions: {
            type: model?.cornersSquareOptions?.type === "none" ? undefined : model?.cornersSquareOptions?.type,
            ...(model?.cornersSquareOptions?.color?.isCustom
                ? transformColor(model?.cornersSquareOptions?.color?.content)
                : {
                    color: undefined,
                    gradient: undefined
                })
        }
    }
}
const model = reactive<Model>({
    data: initialText,
    image: "",
    width: 200,
    height: 200,
    margin: 10,
    errorCorrectionLevel: "Q",
    logoOptions: undefined,
    backgroundOptions: undefined,
    dotsOptions: undefined,
    cornersOptions: undefined,
    cornersSquareOptions: undefined,
})

const qrCode = new QRCodeStyling();
const qrCodeRef = ref<HTMLDivElement | null>(null)

onMounted(() => {
    if (qrCodeRef.value) {
        qrCode.append(qrCodeRef.value)
    }
})

const formRef = ref<FormInst | null>(null)

watch(model, async () => {
    try {
        await formRef.value?.validate() || {}
    } catch (error) {
        return
    }

    const qrCodeOptions = modelToQrcodeOptions(model)
    qrCode.update(qrCodeOptions)
}, {
    immediate: true
})

const rules: FormRules = {}

const errorCorrectionLevelOptions = defineSelectOptionList<Record<ErrorCorrectionLevel, unknown>>({
    L: { label: "L 可遮挡 7%" },
    M: { label: "M 可遮挡 15%" },
    Q: { label: "Q 可遮挡 25%" },
    H: { label: "H 可遮挡 30%" },
})

const downloadFileTypeOptions = defineSelectOptionList<Record<FileExtension, unknown>>({
    svg: { label: "svg" },
    png: { label: "png" },
    jpeg: { label: "jpeg" },
    webp: { label: "webp" }
})

const handleDownload = async (val: FileExtension) => {
    console.log(val)
    await qrCode.download({ extension: val })
}
</script>