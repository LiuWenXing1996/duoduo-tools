<template>
    <template v-if="isFunction(content)">
        <component :is="content"></component>
    </template>
    <template v-else>
        <span class="break-all whitespace-pre-wrap">
            {{ displayTextValue(content) }}
        </span>
    </template>
</template>
<script setup lang="ts">
import { isFunction } from 'radash';
import type { RenderFunction } from 'vue';

export type Props = {
    content: string | number | RenderFunction | object | undefined
}

defineProps<Props>()
</script>