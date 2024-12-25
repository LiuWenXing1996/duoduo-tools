<template>
    <div class="flex items-center justify-center">
        <span>{{ label }}</span>
        <div class="ml-[10px]" v-if="actions.length > 0">
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
export type Props = {
    label?: string,
    actions?: (CommonIconButtonComponentProps | undefined)[]
}
const props = defineProps<Props>()
const actions = computed(() => {
    const actionsValue = props.actions || [];
    return actionsValue
})

</script>