<template>
    <div ref="editorContainer" class="relative">
        <div class="z-10 border w-full">
            <Toolbar class="border-b" :editor="editorRef" :defaultConfig="toolbarConfig" :mode="mode" />
            <Editor :style="{
                height: heightStr,
                overflowY: 'hidden',
            }" v-model="valueHtml" :defaultConfig="editorConfig" :mode="mode" @onCreated="handleCreated" />
        </div>
        <div class="relative overflow-hidden">
            <div ref="poster" class="absolute top-0 -z-10" v-html="valueHtml"></div>
        </div>
    </div>
</template>

<script setup lang="tsx">
import { TinyEmitter } from "tiny-emitter";
import html2canvas from "html2canvas";
import { DomEditor } from '@wangeditor/editor'
import '@wangeditor/editor/dist/css/style.css' // 引入 css
import { onBeforeUnmount, ref, shallowRef } from 'vue'
// @ts-ignore
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
import { setMethods, type TargetWindowMethods } from "~/components/iframe/wang-editor/utils";
const editorContainerRef = useTemplateRef("editorContainer");
const emitter = new TinyEmitter();

useResizeObserver(editorContainerRef, async (entries) => {
    const entry = entries[0]
    const { width, height } = entry.contentRect;
    emitter.emit('resize', { width, height })
});
const editorRef = shallowRef()
const mode = ref('default')
const valueHtml = ref(``)
const toolbarConfig = {
    excludeKeys: ["fullScreen", "uploadImage", "uploadVideo"],
}

const editorConfig = { placeholder: '请输入内容...' }
const heightStr = ref('300px')

onBeforeUnmount(() => {
    const editor = editorRef.value
    if (editor == null) return
    editor.destroy()
})

const handleCreated = (editor: any) => {
    editorRef.value = editor;
    const rect = editorContainerRef.value?.getClientRects()[0];
    if (rect) {
        const { width, height } = rect;
        emitter.emit('resize', { width, height })
    }
    setTimeout(() => {
        const toolbar = DomEditor.getToolbar(editor)
        const curToolbarConfig = toolbar?.getConfig()
        console.log(curToolbarConfig?.toolbarKeys) // 当前菜单排序和分组
    }, 2000);

}

const posterRef = useTemplateRef("poster")

const downloadPng: TargetWindowMethods['downloadPng'] = async (params) => {
    const { bgColor, width, ext } = params;
    if (posterRef.value) {
        const canvas = await html2canvas(posterRef.value, {
            backgroundColor: bgColor,
            useCORS: true,
            width: width,
        })
        let imgString = '';
        if (ext == 'png') {
            imgString = canvas.toDataURL("image/png");
        }
        if (ext == 'jpg') {
            imgString = canvas.toDataURL("image/jpg");
        }
        if (imgString) {
            downloadURL(imgString, `文本转图片.${ext}`);
        }
    }
}

const theme = useTheme();
const changeThemePreference: TargetWindowMethods['changeThemePreference'] = (preference: string) => {
    theme.setPreference(preference)
}

setMethods(window, {
    downloadPng,
    changeThemePreference,
    setEditorHeight: (height) => {
        heightStr.value = height + 'px'
    },
    setValue: (val: string) => {
        valueHtml.value = val
    },
    getValue: () => {
        return valueHtml.value
    },
    getEditorContainerRect: () => {
        const rect = editorContainerRef.value?.getClientRects()[0];
        if (rect) {
            return {
                width: rect.width,
                height: rect.height,
                top: rect.top,
                left: rect.left,
            }
        }
    },
    onResize: (fn) => {
        emitter.on('resize', fn)
    },
})

</script>
<style lang="less">
html.dark-mode {
    // textarea - css vars
    --w-e-textarea-bg-color: #333;
    --w-e-textarea-color: #fff;
    --w-e-textarea-border-color: #ccc;
    --w-e-textarea-slight-border-color: #e8e8e8;
    --w-e-textarea-slight-color: #d4d4d4;
    --w-e-textarea-slight-bg-color: #f5f2f0;
    --w-e-textarea-selected-border-color: #B4D5FF; // 选中的元素，如选中了分割线
    --w-e-textarea-handler-bg-color: #4290f7; // 工具，如图片拖拽按钮

    // toolbar - css vars
    --w-e-toolbar-color: #fff;
    --w-e-toolbar-bg-color: #595959;
    --w-e-toolbar-active-color: #f1f1f1;
    --w-e-toolbar-active-bg-color: #333;
    --w-e-toolbar-disabled-color: #999;
    --w-e-toolbar-border-color: #333;


    // modal - css vars
    --w-e-modal-button-bg-color: #333;
    --w-e-modal-button-border-color: #333;
}
</style>