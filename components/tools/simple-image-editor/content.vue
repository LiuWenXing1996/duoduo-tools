<template>
    <tool-content :vertical="{
        enabled: true,
        top: {
            class: '!h-[15%]'
        },
        bottom: {
            class: '!h-[85%]'
        }
    }" :output="{
        area: {
            label: '配置'
        },
        scroll: {
            disabled: true,
        }
    }">
        <template #output>
            <div class="size-full absolute">
                <tui-image-editor @on-inited="(v) => {
                        imageEditorInstanceRef = v
                    }" />
            </div>
        </template>
    </tool-content>
</template>

<script setup lang="tsx">
import type ImageEditor from 'tui-image-editor'

export type Model = {
    content: string,
}

export type Result = {
    content: string,
}

const imageEditorInstanceRef = shallowRef<ImageEditor | undefined>()

</script>