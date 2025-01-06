<template>
    <tool-content :vertical="{
        enabled: true,
        top: {
            class: '!h-[15%]'
        },
        bottom: {
            class: '!h-[85%]'
        }
    }" :output="{
        area: {
            label: '信息',
            labelActions: [
                {
                    name: 'common-refresh',
                    onClick: handleRefresh
                }
            ]
        }
    }">
        <template #output>
            <n-list hoverable clickable>
                <n-list-item v-for="groupItem in result.group">
                    <n-thing :title="groupItem.label" content-style="margin-top: 10px;">
                        <key-value :data="groupItem.items" />
                    </n-thing>
                </n-list-item>
            </n-list>
        </template>
    </tool-content>
</template>
<script setup lang="ts">
import { UAParser } from 'ua-parser-js';

export type Result = {
    group: {
        label: string,
        items: KeyValueComponentProps['data']
    }[],
}

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
const result: ComputedRef<Result> = computed(() => {
    const refreshEmptyStr = refreshTag.value ? "" : ""
    const ua = navigator.userAgent + refreshEmptyStr;
    const { browser, cpu, os } = UAParser(ua);
    const orientationType = getOrientationType()
    const group: Result['group'] = [
        {
            label: "屏幕",
            items: [
                {
                    label: "大小",
                    value: `${window.screen.availWidth} x ${window.screen.availHeight}`,
                    valueCopy: true
                },
                {
                    label: "方向",
                    value: `${orientationType.label}(${orientationType.value})`,
                    valueCopy: true
                },
                {
                    label: "旋转角度",
                    value: `${window.screen.orientation.angle}°`,
                    valueCopy: true
                },
                {
                    label: "色彩深度",
                    value: `${window.screen.colorDepth} 位`,
                    valueCopy: true
                },
                {
                    label: `设备像素比(dpr)`,
                    value: `${window.devicePixelRatio} dppx`,
                    valueCopy: true
                },
                {
                    label: `窗口大小`,
                    value: `${width.value} x ${height.value}`,
                    valueCopy: true
                },

            ]
        },
        {
            label: "浏览器",
            items: [
                {
                    label: "名称",
                    value: browser.name || "-",
                    valueCopy: true
                },
                {
                    label: "版本号",
                    value: browser.version || "-",
                    valueCopy: true
                },
                {
                    label: "主版本",
                    value: browser.major || "-",
                    valueCopy: true
                },
                {
                    label: "浏览器供应商",
                    value: navigator.vendor,
                    valueCopy: true
                },
                {
                    label: "用户代理(User-Agent)",
                    value: ua,
                    valueCopy: true
                },
            ]
        },
        {
            label: "设备",
            items: [
                {
                    label: "首选语言",
                    value: language.value || "-",
                    valueCopy: true
                },
                {
                    label: "操作系统",
                    value: os.name || navigator.platform,
                    valueCopy: true
                },
                {
                    label: "操作系统版本",
                    value: os.version || "-",
                    valueCopy: true
                },
                {
                    label: "CPU 架构",
                    value: cpu.architecture || "-",
                    valueCopy: true
                },
                {
                    label: "CPU 核心数",
                    value: `${navigator.hardwareConcurrency}`,
                    valueCopy: true
                },
            ]
        },
        {
            label: "电池",
            items: [
                {
                    label: "检测到电池",
                    value: battery.isSupported.value ? "是" : "否",
                    valueCopy: true
                },
                {
                    label: "充电中",
                    value: battery.charging.value ? "是" : "否",
                    valueCopy: true
                },
                {
                    label: "电量",
                    value: `${battery.level.value * 100}%`,
                    valueCopy: true
                },
                {
                    label: "充电时间",
                    value: `${battery.chargingTime.value}秒`,
                    valueCopy: true
                },
                {
                    label: "续航时间",
                    value: `${battery.dischargingTime.value}秒`,
                    valueCopy: true
                }
            ]
        }
    ]

    return {
        group
    }
})

</script>