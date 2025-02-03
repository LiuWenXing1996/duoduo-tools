<template>
    <div class="relative size-full min-h-[100px] " :style="{
        height: heightStr,
    }">
        <div class="absolute top-0 bottom-0 left-0 right-0">
            <n-spin :show="isLoad" size="small" class="size-full" content-class="size-full">
                <div ref="editorContainer" class="size-full">
                    <iframe @load="handleLoad" ref="editorIframe" class="size-full" :src="target"></iframe>
                </div>
            </n-spin>
        </div>
    </div>
</template>
<script setup lang="ts">
import { getMethods } from './utils';

const router = useRouter();
const editorUrl = router.resolve(
    "/wang-editor"
);
const heightStr = ref('500px')
const absoluteEditorFullUrl = new URL(
    editorUrl.href,
    window.location.origin
).toString();
const target = absoluteEditorFullUrl;
const editorIframeRef = useTemplateRef('editorIframe');
const isLoad = ref(true);
const getTargetWindowMethods = () => {
    if (!editorIframeRef.value?.contentWindow) {
        return
    }
    return getMethods(editorIframeRef.value?.contentWindow)
};
const tryListen = () => {
    const methods = getTargetWindowMethods();
    if (methods) {
        const rect = methods.getEditorContainerRect();
        rect && (heightStr.value = `${rect.height}px`);
        methods?.onResize((params) => {
            heightStr.value = `${params.height}px`;
        });
        return
    }
    setTimeout(() => {
        tryListen();
    }, 100);
}
const handleLoad = () => {
    isLoad.value = false;
    tryListen();
}
const theme = useTheme();
watch(
    [() => theme.preference.value],
    ([preference]) => {
        const methods = getTargetWindowMethods();
        methods?.changeThemePreference(preference);
    },
    { immediate: true }
);
defineExpose({
    getTargetWindowMethods
})
</script>