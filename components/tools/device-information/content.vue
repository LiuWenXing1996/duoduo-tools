<template>
    <tool-wrapper :vertical="{
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
            <group-list :data="result" />
        </template>
    </tool-wrapper>
</template>
<script setup lang="ts">
import { UAParser } from 'ua-parser-js';

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
const result: ComputedRef<GroupListComponentProps['data']> = computed(() => {
    const refreshEmptyStr = refreshTag.value ? "" : ""
    const ua = navigator.userAgent + refreshEmptyStr;
    const { browser, cpu, os } = UAParser(ua);
    const orientationType = getOrientationType()
    const groups: GroupListComponentProps['data'] = [
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

    return groups
})

</script>