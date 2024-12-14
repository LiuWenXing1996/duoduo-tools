<template>
    <define-tool-wrapper :vertical="{
        enabled: true,
        top: {
            class: '!h-[15%]'
        },
        bottom: {
            class: '!h-[85%]'
        }
    }" :output="{
        area: {
            label: '信息'
        }
    }">
        <template #output>
            <n-list hoverable clickable>
                <n-list-item v-for="group in groups">
                    <n-thing :title="group.label" content-style="margin-top: 10px;">
                        <n-descriptions label-placement="left" :column="1" label-class="w-[120px] inline-flex"
                            content-class="w-[calc(100%-120px)]">
                            <n-descriptions-item v-for="item in group.items">
                                <template #label>
                                    <div class="inline-flex">
                                        <span class="font-medium break-all">
                                            {{ item.label }}
                                        </span>
                                    </div>
                                </template>
                                <div class="inline-flex">
                                    <span class=" break-all">
                                        {{ item.value }}
                                        <n-tooltip trigger="hover" v-if="item.value !== ''">
                                            <template #trigger>
                                                <div class=" inline-flex">
                                                    <svg-icon class="ml-[2px] pb-[5px] text-[12px] cursor-pointer"
                                                        name="common-copy" @click="copy(item.value)" />
                                                </div>
                                            </template>
                                            {{ `点击复制` }}
                                        </n-tooltip>
                                    </span>

                                </div>
                            </n-descriptions-item>
                        </n-descriptions>
                    </n-thing>
                </n-list-item>
            </n-list>
        </template>
        <template #actions>
            <n-space>
                <n-button size="small" @click="handleRefresh">刷新</n-button>
            </n-space>
        </template>
    </define-tool-wrapper>
</template>
<script setup lang="ts">
import { UAParser } from 'ua-parser-js';
export type Item = {
    label: string,
    value: string
}

export type ItemGroup = {
    label: string,
    items: Item[]
}
const copy = useCopy()
const { width, height } = useWindowSize();
const battery = useBattery();
const { language } = useNavigatorLanguage();

const getOrientationType = () => {
    const type = window.screen.orientation.type;
    let label = "未知";
    if (type === "landscape-primary") {
        label = "竖屏正向"
    }
    if (type === "landscape-secondary") {
        label = "竖屏反向"
    }
    if (type === "portrait-primary") {
        label = "横屏正向"
    }
    if (type === "portrait-secondary") {
        label = "横屏反向"
    }
    return {
        label,
        value: type
    }
}
const refreshTag = ref(false);
const handleRefresh = () => {
    refreshTag.value = !refreshTag.value
}
const groups: ComputedRef<ItemGroup[]> = computed(() => {
    const refreshEmptyStr = refreshTag.value ? "" : ""
    const ua = navigator.userAgent + refreshEmptyStr;
    const { browser, cpu, os } = UAParser(ua);
    const orientationType = getOrientationType()
    return [
        {
            label: "屏幕",
            items: [
                {
                    label: "大小",
                    value: `${window.screen.availWidth} x ${window.screen.availHeight}`
                },
                {
                    label: "方向",
                    value: `${orientationType.label}(${orientationType.value})`
                },
                {
                    label: "旋转角度",
                    value: `${window.screen.orientation.angle}°`
                },
                {
                    label: "色彩深度",
                    value: `${window.screen.colorDepth} 位`
                },
                {
                    label: `设备像素比(dpr)`,
                    value: `${window.devicePixelRatio} dppx`
                },
                {
                    label: `窗口大小`,
                    value: `${width.value} x ${height.value}`
                },

            ]
        },
        {
            label: "浏览器",
            items: [
                {
                    label: "名称",
                    value: browser.name || "-"
                },
                {
                    label: "版本号",
                    value: browser.version || "-"
                },
                {
                    label: "主版本",
                    value: browser.major || "-"
                },
                {
                    label: "浏览器供应商",
                    value: navigator.vendor
                },
                {
                    label: "用户代理(User-Agent)",
                    value: ua
                },
            ]
        },
        {
            label: "设备",
            items: [
                {
                    label: "首选语言",
                    value: language.value || "-"
                },
                {
                    label: "操作系统",
                    value: os.name || navigator.platform
                },
                {
                    label: "操作系统版本",
                    value: os.version || "-"
                },
                { label: "CPU 架构", value: cpu.architecture || "-" },
                { label: "CPU 核心数", value: `${navigator.hardwareConcurrency}` },
            ]
        },
        {
            label: "电池",
            items: [
                {
                    label: "检测到电池",
                    value: battery.isSupported.value ? "是" : "否"
                },
                {
                    label: "充电中",
                    value: battery.charging.value ? "是" : "否"
                },
                {
                    label: "电量",
                    value: `${battery.level.value * 100}%`
                },
                {
                    label: "充电时间",
                    value: `${battery.chargingTime.value}秒`
                },
                {
                    label: "续航时间",
                    value: `${battery.dischargingTime.value}秒`
                }
            ]
        }
    ]
})

</script>