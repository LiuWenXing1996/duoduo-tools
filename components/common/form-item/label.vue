<template>
    <div class="flex items-center justify-center">
        <span>{{ label }}</span>
        <div class="ml-[2px]" v-if="actions.length > 0">
            <n-space :size="10">
                <template v-for="item in actions">
                    <template v-if="item">
                        <common-icon-button v-bind="item" />
                    </template>
                </template>
            </n-space>
        </div>
    </div>
</template>

<script setup lang="ts">
import {isFunction} from "radash"
export type Props = {
    label?: string,
    actions?: (CommonIconButtonComponentProps | undefined|(()=>CommonIconButtonComponentProps|undefined))[]
}
const props = defineProps<Props>()
const actions = computed(() => {
    const actionsValue = (props.actions || []).map(item => {
        if (!item) {
            return undefined
        }
        if (isFunction(item)) {
            return item()
        }
        return item
    });
    return actionsValue
})

</script>