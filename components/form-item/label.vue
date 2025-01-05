<template>
    <div class="flex items-center justify-center">
        <span>
            <common-rich-text :content="label" />
        </span>
        <div class="ml-[2px]" v-if="actions.length > 0">
            <n-space :size="10">
                <template v-for="item in actions">
                    <template v-if="item">
                        <icon-button v-bind="item" />
                    </template>
                </template>
            </n-space>
        </div>
    </div>
</template>

<script setup lang="ts">
import { isFunction } from "radash"
import type { RenderFunction } from "vue";
export type Props = {
    label?: string | (RenderFunction),
    actions?: (IconButtonComponentProps | undefined | (() => IconButtonComponentProps | undefined))[]
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