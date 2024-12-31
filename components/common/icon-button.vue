<template>
    <common-tooltip-wrapper v-bind="config.tooltipWrapper">
        <n-button v-bind="config.button">
            <template #icon v-if="config.icon">
                <svg-icon v-bind="config.icon"></svg-icon>
            </template>
        </n-button>
    </common-tooltip-wrapper>
</template>
<script setup lang="ts">
import { assign, construct } from "radash";
import type { DeepPartial, DeepRequired } from "ts-essentials";
import type { ButtonProps } from "naive-ui";

const types = ["common", "simple"] as const;
export type Type = typeof types[number]
export type Config = {
  icon?: SvgIconComponentProps;
  button?: ButtonProps;
  tooltipWrapper?: CommonTooltipWrapperComponentProps;
};

const defaultTypes: Record<Type, Config> = {
    common: {
        button: {
            strong: true,
            secondary: true,
            circle: true,
            size: "tiny",
        },
        tooltipWrapper: {
            tooltip: {
                keepAliveOnHover: false,
            },
        },
    },
    simple: {
        button: {
            quaternary: true,
            size: "tiny",
        },
        tooltipWrapper: {
            tooltip: {
                keepAliveOnHover: false,
            },
        },
    },
};

export type Props = {
    type: Type,
    shortcut?: {
        "icon.name"?: DeepRequired<Config>['icon']['name'],
        "button.onClick"?: DeepRequired<Config>['button']['onClick'],
        "tooltipWrapper.content"?: DeepRequired<Config>['tooltipWrapper']['content'],
        "tooltipWrapper.enabled"?: DeepRequired<Config>['tooltipWrapper']['enabled'],
    },
    custom?: DeepPartial<Config>
}
const props = defineProps<Props>()
const config = computed(() => {
    const shortcut = props.shortcut || {};
    const shortcutVals = construct(shortcut);
    const valWitchShortcut = assign<Config>(
        defaultTypes[props.type],
        shortcutVals
    )
    const newVal = assign<Config>(
        valWitchShortcut,
        (props.custom || {}) as Config
    )
    return newVal
})
</script>
