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
import {
    type IconButtonConfig,
    type IconButtonType,
    defaultTypes
} from "./utils";
import type { DeepPartial, DeepRequired } from "ts-essentials";

export type Props = {
    type: IconButtonType,
    shortcut?: {
        "icon.name"?: DeepRequired<IconButtonConfig>['icon']['name'],
        "button.onClick"?: DeepRequired<IconButtonConfig>['button']['onClick'],
        "tooltipWrapper.content"?: DeepRequired<IconButtonConfig>['tooltipWrapper']['content'],
        "tooltipWrapper.enabled"?: DeepRequired<IconButtonConfig>['tooltipWrapper']['enabled'],
    },
    custom?: DeepPartial<IconButtonConfig>
}
const props = defineProps<Props>()
const config = computed(() => {
    const shortcut = props.shortcut || {};
    const shortcutVals = construct(shortcut);
    const valWitchShortcut = assign<IconButtonConfig>(
        defaultTypes[props.type],
        shortcutVals
    )
    const newVal = assign<IconButtonConfig>(
        valWitchShortcut,
        (props.custom || {}) as IconButtonConfig
    )
    return newVal
})
</script>
