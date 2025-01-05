<template>
    <tooltip-wrapper :="config.tooltipWrapper">
        <n-button :="config.button">
            <template #icon v-if="config.icon">
                <svg-icon v-bind="config.icon" />
            </template>
        </n-button>
    </tooltip-wrapper>
</template>
<script setup lang="ts">
import type { ButtonProps } from 'naive-ui';
import { assign } from 'radash';

export type Props = {
    name: string,
    tooltip?: string,
    custom?: Config,
} & /*@vue-ignore*/ ExpandProps<Emits>

export type Emits = {
    click: [e: MouseEvent],
}

export type Config = {
    icon?: SvgIconComponentProps;
    button?: ButtonProps;
    tooltipWrapper?: TooltipWrapperComponentProps;
};
const defaultConfig: Config = {
    button: {
        quaternary: true,
        size: "tiny",
    },
    tooltipWrapper: {
        tooltip: {
            keepAliveOnHover: false,
        },
    },
}
const props = defineProps<Props>()
const emits = defineEmits<Emits>()
const config = computed(() => {
    const input: Config = {
        icon: {
            name: props.name,
        },
        button: {
            onClick: (e) => {
                emits('click', e)
            },
        },
        tooltipWrapper: {
            content: props.tooltip,
            enabled: props.tooltip ? true : false,
        },
    }

    const valWitchInput = assign<Config>(
        defaultConfig,
        input
    )
    const valWithCustom = assign<Config>(
        valWitchInput,
        (props.custom || {}) as Config
    )
    return valWithCustom
})
</script>
