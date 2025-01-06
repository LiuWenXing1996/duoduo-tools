<template>
    <tool-wrapper>
        <template #input>
            <n-form ref="formRef" :model="model" require-mark-placement="left">
                <define-tool-area label="WIFI">
                    <n-form-item v-bind="formItemPropsMap['wifi.ssid']">
                        <n-input clearable v-model:value="model.wifi.ssid" />
                    </n-form-item>
                    <n-form-item v-bind="formItemPropsMap['append.wifi.encryption.type']">
                        <n-select :options="encryptionTypeOptions" v-model:value="model.append.wifi.encryption.type" />
                    </n-form-item>
                    <template v-if="model.append.wifi.encryption.type !== 'none'">
                        <n-form-item v-bind="formItemPropsMap['append.wifi.encryption.password']">
                            <n-input v-model:value="model.append.wifi.encryption.password" type="password"
                                show-password-on="click" />
                        </n-form-item>
                    </template>
                    <n-form-item v-bind="formItemPropsMap['wifi.isHidden']">
                        <n-switch v-model:value="model.wifi.isHidden" />
                    </n-form-item>
                </define-tool-area>
                <define-tool-area label="基础">

                    <n-form-item path="qr.width" first label="宽度">
                        <n-input-number v-model:value="model.qr.width" :min="1" :step="50">
                            <template #suffix>
                                像素
                            </template>
                        </n-input-number>
                    </n-form-item>
                    <n-form-item path="qr.height" first label="高度">
                        <n-input-number v-model:value="model.qr.height" :min="1" :step="50">
                            <template #suffix>
                                像素
                            </template>
                        </n-input-number>
                    </n-form-item>
                    <n-form-item path="qr.margin" first label="边距">
                        <n-input-number v-model:value="model.qr.margin" :min="0" :step="10">
                            <template #suffix>
                                像素
                            </template>
                        </n-input-number>
                    </n-form-item>
                    <n-form-item path="qr.errorCorrectionLevel" first label="纠错级别">
                        <n-select v-model:value="model.qr.errorCorrectionLevel"
                            :options="errorCorrectionLevelOptions" />
                    </n-form-item>
                </define-tool-area>
                <define-tool-area label="图标">
                    <tools-qrcode-generator-logo-options-form ref="logoOptions" />
                </define-tool-area>
                <define-tool-area label="背景">
                    <tools-qrcode-generator-background-options-form ref="backgroundOptions" />
                </define-tool-area>
                <define-tool-area label="信息点">
                    <tools-qrcode-generator-dots-options-form ref="dotsOptions" />
                </define-tool-area>
                <define-tool-area label="定位点">
                    <tools-qrcode-generator-corners-options-form ref="cornersOptions" />
                </define-tool-area>
                <define-tool-area label="定位点边框">
                    <tools-qrcode-generator-corners-square-options-form ref="cornersSquareOptions" />
                </define-tool-area>
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
    </tool-wrapper>
</template>
<script setup lang="ts">
import { wifiConnectGenerator } from './utils';
import QRCodeStyling, { type ErrorCorrectionLevel, type FileExtension, type Gradient, type Options } from 'qr-code-styling';

export type EncryptionType = ToolsWifiQrcodeGeneratorUtilsComponentExports['EncryptionType'] | "none"

export type Model = {
    wifi: Omit<ToolsWifiQrcodeGeneratorUtilsComponentExports['ConnectGeneratorOptions'], "encryption">,
    qr: Pick<Options, "image" | "width" | "height" | "margin"> & {
        errorCorrectionLevel: ErrorCorrectionLevel,
        logoOptions: ToolsQrcodeGeneratorLogoOptionsFormComponentModel | undefined,
        backgroundOptions: ToolsQrcodeGeneratorBackgroundOptionsFormComponentModel | undefined,
        dotsOptions: ToolsQrcodeGeneratorDotsOptionsFormComponentModel | undefined,
        cornersOptions: ToolsQrcodeGeneratorCornersOptionsFormComponentModel | undefined,
        cornersSquareOptions: ToolsQrcodeGeneratorCornersSquareOptionsFormComponentModel | undefined,
    },
    append: {
        wifi: {
            encryption: {
                type: EncryptionType,
                password?: string
            }
        }
    }
}
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
const model = reactive<Model>({
    wifi: {
        ssid: "wifi123",
    },
    qr: {
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
    },
    append: {
        wifi: {
            encryption: {
                type: "WPA/WPA2",
                password: "123"
            }
        }
    },
})

const qrCode = new QRCodeStyling();
const qrCodeRef = ref<HTMLDivElement | null>(null)


const form = useTemplateRef("formRef")
const dotsOptionsRef = useTemplateRef('dotsOptions');
const cornersOptionsRef = useTemplateRef('cornersOptions');
const cornersSquareOptionsRef = useTemplateRef('cornersSquareOptions');
const backgroundOptionsRef = useTemplateRef('backgroundOptions');
const logoOptionsRef = useTemplateRef('logoOptions');
watch(() => logoOptionsRef.value?.model, (val) => {
    model.qr.logoOptions = val
})

watch(() => dotsOptionsRef.value?.model, (val) => {
    model.qr.dotsOptions = val
})
watch(() => cornersOptionsRef.value?.model, (val) => {
    model.qr.cornersOptions = val
})
watch(() => cornersSquareOptionsRef.value?.model, (val) => {
    model.qr.cornersSquareOptions = val
})
watch(() => backgroundOptionsRef.value?.model, (val) => {
    model.qr.backgroundOptions = val
})
onMounted(() => {
    if (qrCodeRef.value) {
        qrCode.append(qrCodeRef.value)
    }
})
const formItemPropsMap = defineFromItemPropsMap(
    {
        "wifi.ssid": {
            config: {
                label: "WIFI名称/SSID",
                rules: (config) => {
                    const { label } = config;
                    return [
                        {
                            required: true,
                            message: `${label} 必填`
                        }
                    ]
                }
            }
        },
        "append.wifi.encryption.type": {
            config: {
                label: "加密方式",
            }
        },
        "append.wifi.encryption.password": {
            config: {
                label: "密码",
                rules: (config) => {
                    const { label } = config;
                    return [
                        {
                            required: true,
                            message: `${label} 必填`
                        }
                    ]
                }
            }
        },
        "wifi.isHidden": {
            config: {
                label: "是否为隐藏网络",
            }
        }
    },
    {
        first: true
    }
)

const genRequest = useCustomRequest(
    async () => {
        try {
            const isValid = await form.value?.validate();
            if (!isValid) {
                return
            }
            const qrCodeOptions = modelToQrcodeOptions(model)
            qrCode.update(qrCodeOptions)
        } catch (error) {
            // genRequest.mutate("")
            throw error
        }
    },
    {
        loadingKeep: 0
    }
)

const modelToWifiConnect = (model: Model): string => {
    let encryption: ToolsWifiQrcodeGeneratorUtilsComponentExports['ConnectGeneratorOptions']['encryption'] = undefined
    if (model.append.wifi.encryption.type !== "none") {
        const type = model.append.wifi.encryption.type
        encryption = {
            type,
            password: model.append.wifi.encryption.password || ""
        }
    }
    return wifiConnectGenerator({
        ssid: model.wifi.ssid,
        isHidden: model.wifi.isHidden,
        encryption: encryption
    });
}

const modelToQrcodeOptions = (model: Model): Options => {
    const qr = model.qr;
    const utf8_encode = function (s: string) {
        return unescape(encodeURIComponent(s));
    };

    const transformColor = (color: ToolsQrcodeGeneratorColorFormComponentModel | undefined): {
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

    const data = modelToWifiConnect(model)

    return {
        data: utf8_encode(data || ""),
        image: qr.logoOptions?.image,
        height: qr.height,
        width: qr.width,
        margin: qr.margin,
        qrOptions: {
            errorCorrectionLevel: qr.errorCorrectionLevel
        },
        imageOptions: {
            imageSize: qr.logoOptions?.size ? qr.logoOptions?.size / 100 : undefined,
            margin: qr.logoOptions?.margin,
            hideBackgroundDots: qr.logoOptions?.hideBackgroundDots,
        },
        backgroundOptions: {
            round: qr.backgroundOptions?.round ? (qr.backgroundOptions?.round / 100) : undefined,
            ...(qr.backgroundOptions?.color?.isCustom
                ? transformColor(qr.backgroundOptions?.color?.content)
                : {
                    color: "#fff",
                    gradient: undefined
                })
        },
        dotsOptions: {
            type: qr.dotsOptions?.type,
            ...transformColor(qr.dotsOptions?.color)
        },
        cornersDotOptions: {
            type: qr.cornersOptions?.type === "none" ? undefined : qr.cornersOptions?.type,
            ...(qr.cornersOptions?.color?.isCustom
                ? transformColor(qr.cornersOptions?.color?.content)
                : {
                    color: undefined,
                    gradient: undefined
                })
        },
        cornersSquareOptions: {
            type: qr?.cornersSquareOptions?.type === "none" ? undefined : qr?.cornersSquareOptions?.type,
            ...(qr?.cornersSquareOptions?.color?.isCustom
                ? transformColor(qr?.cornersSquareOptions?.color?.content)
                : {
                    color: undefined,
                    gradient: undefined
                })
        }
    }
}
watch(
    () => model,
    () => {
        genRequest.run()
    },
    {
        deep: true,
        immediate: true
    }
)

const encryptionTypeOptions = defineSelectOptionList<Record<EncryptionType, unknown>>({
    "WPA/WPA2": { label: "WPA/WPA2" },
    "WEP": { label: "WEP" },
    "none": { label: "未加密" }
})

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