<template>
    <n-form-item :="config.formItem">
        <n-radio-group :="config.radioGroup">
            <n-space :="config.space">
                <template v-for="item in config.radioList">
                    <n-radio :="item" />
                </template>
            </n-space>
        </n-radio-group>
    </n-form-item>
</template>
<script setup lang="tsx">
import type { FormItemProps, RadioGroupProps, RadioProps, SpaceProps } from 'naive-ui'
import { assign, construct, isFunction } from 'radash'
import type { DeepPartial } from 'ts-essentials'

export type Type = "common"
export type Config = {
    formItem?: FormItemProps,
    radioGroup?: RadioGroupProps,
    radioList?: RadioProps[],
    space?: SpaceProps
}
export type Props = {
    type: Type,
    shortcut?: {},
    custom?: DeepPartial<Config> | (() => DeepPartial<Config>)
}
const props = defineProps<Props>()
const defaultTypes: Record<Type, Config> = {
    "common": {
        formItem: {
            first: true
        },
    },
};
const config = computed(() => {
    const shortcut = props.shortcut || {};
    const shortcutVals = construct(shortcut);
    const valWitchShortcut = assign<Config>(
        defaultTypes[props.type],
        shortcutVals
    )
    const customVal = isFunction(props.custom) ? props.custom() : props.custom;
    const newVal = assign<Config>(
        valWitchShortcut,
        (customVal || {}) as Config
    )
    return newVal
})
</script>