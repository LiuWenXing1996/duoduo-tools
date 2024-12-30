<template>
    <n-form-item :="config.formItem">
        <n-checkbox-group :="config.checkboxGroup">
            <n-space>
                <template v-for="item in config.checkboxList">
                    <n-checkbox :="item" />
                </template>
            </n-space>
        </n-checkbox-group>
    </n-form-item>
</template>
<script setup lang="tsx">
import type { FormItemProps, CheckboxGroupProps, CheckboxProps } from 'naive-ui'
import { assign, construct, isFunction } from 'radash'
import type { DeepPartial } from 'ts-essentials'

export type Type = "common"
export type Config = {
    formItem?: FormItemProps,
    checkboxGroup?: CheckboxGroupProps,
    checkboxList?: CheckboxProps[],
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