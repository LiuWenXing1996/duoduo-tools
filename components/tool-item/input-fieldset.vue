<template>
    <fieldset class="rounded-[8px] border p-[10px] mt-[10px] first:mt-[0px] shadow-md" >
        <legend class="-ml-[4px] px-[10px] text-[14px] font-medium">
            <slot name="label"></slot>
        </legend>
        <slot name="default"></slot>
    </fieldset>
</template>
<script setup lang="ts">
defineSlots<{
    label(): any
    default(): any
}>()
</script>