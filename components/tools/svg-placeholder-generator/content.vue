<template>
    <define-tool-wrapper>
        <template #input>
            <n-form ref="form" :model="model">
                <define-tool-area label="配置">
                    <n-form-item :="formItemPropsMap.width">
                        <n-input-number v-model:value="model.width" :min="0" />
                    </n-form-item>
                    <n-form-item :="formItemPropsMap.height">
                        <n-input-number v-model:value="model.height" :min="0" />
                    </n-form-item>
                    <n-form-item :="formItemPropsMap.fontSize">
                        <n-input-number v-model:value="model.fontSize" />
                    </n-form-item>
                    <n-form-item :="formItemPropsMap.customText">
                        <n-input v-model:value="model.customText" />
                    </n-form-item>
                    <n-form-item :="formItemPropsMap.bgColor">
                        <n-color-picker :render-label="() => ''" v-model:value="model.bgColor" />
                    </n-form-item>
                    <n-form-item :="formItemPropsMap.fgColor">
                        <n-color-picker :render-label="() => ''" v-model:value="model.fgColor" />
                    </n-form-item>
                </define-tool-area>
            </n-form>
        </template>
        <template #output>
            <common-key-value v-if="resKeyValueList" :item-label-width="70" :data="resKeyValueList" />
        </template>
        <template #actions>
            <n-space>
                <!-- <n-dropdown trigger="click" :options="downloadFileTypeOptions" @select="handleDownload">
                    <n-button size="small">
                        下载图片
                    </n-button>
                </n-dropdown> -->
                <n-button size="small" @click="handleDownload('svg')">下载图片</n-button>
            </n-space>
        </template>
    </define-tool-wrapper>
</template>

<script setup lang="tsx">
import { IconButtonType } from "~/components/common/icon-button/utils";

export type Model = {
    width: number,
    height: number,
    fontSize: number,
    bgColor: string,
    fgColor: string,
    customText: string
}

export type Result = {
    svgString: string,
    base64: string,
    dataUrl: string
}
const copy = useCopy()
const model = reactive<Model>({
    width: 200,
    height: 200,
    fontSize: 20,
    bgColor: "#cccccc",
    fgColor: "#333333",
    customText: ""
})

const formRef = useTemplateRef("form")
const formItemPropsMap = defineFromItemPropsMap(
    {
        "width": {
            config: {
                label: "宽度",
            }
        },
        "height": {
            config: {
                label: "高度",
            }
        },
        "fontSize": {
            config: {
                label: "字体大小",
            }
        },
        "customText": {
            config: {
                label: "自定义文本",
            }
        },
        "bgColor": {
            config: {
                label: "背景色",
            }
        },
        "fgColor": {
            config: {
                label: "字体颜色",
            }
        }
    },
    {
        first: true
    }
)
const resRequest = useCustomRequest<Result | undefined>(async () => {
    let res: Result | undefined = undefined;
    try {
        await formRef.value?.validate();
        const svgString = genSvgString();
        const base64 = textToBase64(svgString);
        const dataUrl = base64ToDataURLByFileExtension(base64, "svg")
        res = {
            svgString,
            base64,
            dataUrl
        }
    } catch (error) {
        resRequest.mutate(undefined)
        throw error
    }
    return res;
}, {
    loadingKeep: 0,
    debounceOptions: {
        leading: true
    }
})
watch(() => model, () => {
    resRequest.run()
}, {
    immediate: true,
    deep: true
})
const resKeyValueList = computed<CommonKeyValueComponentProps['data'] | undefined>(() => {
    if (!resRequest.data.value) {
        return
    };
    const data = resRequest.data.value
    const kvList: CommonKeyValueComponentProps['data'] = [
        {
            label: "图片",
            value: () => {
                return <img src={data.dataUrl} alt="占位图片"></img>
            }
        },
        {
            label: "svg",
            value: data.svgString,
            valueActions: [
                {
                    type: IconButtonType["form-label-action"],
                    shortcut: {
                        'icon.name': "common-copy",
                        "button.onClick": () => {
                            copy(data.svgString)
                        }
                    }
                }
            ]
        },
        {
            label: "base64",
            value: data.base64,
            valueActions: [
                {
                    type: IconButtonType["form-label-action"],
                    shortcut: {
                        'icon.name': "common-copy",
                        "button.onClick": () => {
                            copy(data.base64)
                        }
                    }
                }
            ]
        }
    ]
    return kvList
})
const genSvgString = () => {
    const w = model.width;
    const h = model.height;
    const text = model.customText || `${w}x${h}`;
    const bgColor = model.bgColor;
    const fontSize = model.fontSize;
    const fgColor = model.fgColor;
    const size = ` width="${w}" height="${h}"`;

    return `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}"${size}>
  <rect width="${w}" height="${h}" fill="${bgColor}"></rect>
  <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="monospace" font-size="${fontSize}px" fill="${fgColor}">${text}</text>   
</svg>
  `.trim();
}
const FileExtensions = ["png", "jpeg", "webp", "svg"] as const
export type FileExtension = (typeof FileExtensions)[number];
// TODO: 支持多种格式下载
const downloadFileTypeOptions = defineSelectOptionList<Record<FileExtension, unknown>>({
    png: { label: "png" },
    jpeg: { label: "jpeg" },
    webp: { label: "webp" },
    svg: { label: "svg" }
})
const handleDownload = async (val: FileExtension) => {
    if (!resRequest.data.value) {
        return
    };
    const data = resRequest.data.value;
    const dataUrl = base64ToDataURLByFileExtension(data.base64, val)
    downloadURL(dataUrl, `占位图片.${val}`);
}

</script>