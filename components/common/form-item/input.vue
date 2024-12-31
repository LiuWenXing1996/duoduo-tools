<template>
    <n-form-item :="config.formItem">
        <n-input :="config.input" />
    </n-form-item>
</template>
<script setup lang="tsx">
import type { FormItemProps, InputProps } from 'naive-ui'
import { assign, construct } from 'radash'
import type { DeepPartial } from 'ts-essentials'

export type Type = "common"
export type Config = {
    formItem?: FormItemProps,
    input?: InputProps,
}
export type Props = {
    type: Type,
    shortcut?: {},
    custom?: DeepPartial<Config>
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
    const newVal = assign<Config>(
        valWitchShortcut,
        (props.custom || {}) as Config
    )
    return newVal
})
</script>