<template>
    <template v-if="!disabled">
        <fieldset class="rounded-[8px]  border-dashed border-2 p-[10px] mt-[10px] first:mt-[0px]">
            <legend class="-ml-[4px] px-[10px] text-[14px] font-medium" v-if="slots.label || label">
                <div class="flex justify-center items-center">
                    <div>
                        <template v-if="slots.label">
                            <slot name="label"></slot>
                        </template>
                        <template v-else>
                            {{ label }}
                        </template>
                    </div>
                    <div v-if="!foldDisabled"
                        class="h-full flex justify-center items-center ml-[2px] p-[2px] rounded-[2px] cursor-pointer hover:bg-secondary"
                        @click="isExpand = !isExpand">
                        <svg-icon name="common-fold" v-if="isExpand" />
                        <svg-icon name="common-unfold" v-else />
                    </div>
                    <template v-if="slots.actions">
                        <div class="ml-[2px] p-[2px]">
                            <slot name="actions"></slot>
                        </div>
                    </template>
                    <div class="ml-[2px]" v-if="labelActions && labelActions.length > 0">
                        <n-space :size="10" class="!gap-0">
                            <template v-for="item in labelActions">
                                <template v-if="item">
                                    <common-icon-button v-bind="item" />
                                </template>
                            </template>
                        </n-space>
                    </div>
                </div>
            </legend>
            <div class="size-full" v-show="isExpand">
                <slot name="default"></slot>
            </div>
        </fieldset>
    </template>
    <template v-else>
        <slot name="default"></slot>
    </template>
</template>
<script setup lang="ts">
export type Props = {
    disabled?: boolean,
    label?: string,
    labelActions?: (CommonIconButtonComponentProps | undefined)[],
    foldDisabled?: boolean
}
defineProps<Props>()
const slots = defineSlots<{
    label?: () => any
    actions?: () => any
    default(): any
}>()
const isExpand = ref(true);

</script>