<script setup lang="ts">
import { onMounted, nextTick } from 'vue'
import 'tui-image-editor/dist/tui-image-editor.css'
import ImageEditor from 'tui-image-editor'
import { locale_zh, customTheme } from "./utils"

const emits = defineEmits < {
    onInited: [instance: ImageEditor | undefined],
} > ()
const instanceRef = shallowRef < ImageEditor | null > (null)
const containerRef = useTemplateRef("container")
onMounted(() => {
    nextTick(() => {
        const instance = init() // 页面创建完成后调用
        emits('onInited', instance)
    })
})

const init = () => {
    if (!containerRef.value) {
        return
    }
    instanceRef.value = new ImageEditor(containerRef.value, {
        includeUI: {
            // loadImage: {
            //     path: "https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg",
            //     name: 'image'
            // },
            menu: ['resize', 'crop', 'rotate', 'draw', 'shape', 'icon', 'text', 'filter'], // 底部菜单按钮列表 隐藏镜像flip和遮罩mask
            // initMenu: 'none', // 默认打开的菜单项
            // menuBarPosition: 'left', // 菜单所在的位置
            // @ts-ignore
            locale: locale_zh, // 本地化语言为中文
            theme: customTheme // 自定义样式
        },
        // cssMaxWidth: 400, // canvas 最大宽度
        // cssMaxHeight: 500 // canvas 最大高度
    })
    try {
        // @ts-ignore
        document.querySelector('#tui-image-editor-svg-default-icons').parentNode.style.display = "none"
    } catch (error) {
    }
    // document.querySelector('tui-image-editor-svg-default-icons')
    // document.getElementsByClassName('tui-image-editor-main')[0].style.top = '0' // 调整图片显示位置
    // document.getElementsByClassName(
    //     'tie-btn-reset tui-image-editor-item help'
    // )[0].style.display = 'none' // 隐藏顶部重置按钮

    return instanceRef.value
}

// 保存图片，并上传
// const save = () => {
//     // base64 文件
//     const base64String = instance.value.toDataURL()
//     //转换blod
//     const url = base64ToBlob(base64String)
//     //传递给父组件
//     emit('getNewImg', url);
// }

defineExpose({

})
</script>
// TODO: 样式待调整
<template>
    <div class="size-full">
        <div ref="container"></div>
    </div>
</template>

<style lang="less" scoped></style>
