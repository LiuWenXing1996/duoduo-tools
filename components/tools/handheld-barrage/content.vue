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
        }
    }">
        <template #output>
            <n-alert title="提示" type="info" class="mb-[10px]">
                全屏播放后，双击屏幕退出全屏
            </n-alert>
            <n-form ref="form" :model="model">
                <n-form-item :="commonFormItemProps" path="content">
                    <template #label>
                        <tool-label label="内容" :actions="[
                            {
                                name: 'common-demo',
                                tooltip: '使用示例',
                                onClick: () => {
                                    addExample()
                                }
                            }
                        ]" />
                    </template>
                    <n-input type="textarea" :rows="3" clearable v-model:value="model.content" />
                </n-form-item>
                <n-form-item :="commonFormItemProps" path="isHorizontal">
                    <template #label>
                        <tool-label label="是否横屏" />
                    </template>
                    <n-switch v-model:value="model.isHorizontal" />
                </n-form-item>
                <n-form-item :="commonFormItemProps" path="speed">
                    <template #label>
                        <tool-label label="弹幕速度" />
                    </template>
                    <n-input-number placeholder="弹幕速度" v-model:value="model.speed" :step="10" />
                </n-form-item>
                <n-form-item :="commonFormItemProps" path="textSize">
                    <template #label>
                        <tool-label label="弹幕大小" />
                    </template>
                    <n-input-number placeholder="弹幕大小" v-model:value="model.textSize" :step="10" />
                </n-form-item>
                <n-form-item :="commonFormItemProps" path="textColor">
                    <template #label>
                        <tool-label label="弹幕颜色" />
                    </template>
                    <n-color-picker v-model:value="model.textColor" />
                </n-form-item>
                <n-form-item :="commonFormItemProps" path="bgColor">
                    <template #label>
                        <tool-label label="背景颜色" />
                    </template>
                    <n-color-picker v-model:value="model.bgColor" />
                </n-form-item>

            </n-form>
            <template v-if="result">
                <div ref="danmuContainer">
                    <div class=" z-10 fixed top-0 left-0 size-full" :class="[
                        isFullPlay ? 'visible' : 'invisible',
                        result.isHorizontal ? 'rotateToHorizontal' : ''
                    ]">
                        <vue-danmaku ref="danmakuFull" v-model:danmus="result.barrage" loop :autoplay="false"
                            :speeds="result.speed" :channels="result.channels" :extraStyle='result.extraStyle'
                            :style="result.danmakuFullStyle" useSlot>
                            <template v-slot:dm="{ danmu }">
                                <div class="" :style="result.extraStyle">
                                    <span>{{ danmu }}</span>
                                </div>
                            </template>
                        </vue-danmaku>
                    </div>
                </div>
            </template>
        </template>
        <template #actions>
            <n-space>
                <n-button size="small" @click="fullPlay">全屏播放</n-button>
            </n-space>
        </template>
    </tool-content>
</template>

<script setup lang="tsx">
import vueDanmaku from 'vue3-danmaku'
import { RegisterDbltouchEvent } from './utils'
export type Model = {
    content: string,
    speed: number,
    textSize: number,
    textColor: string,
    bgColor: string,
    isHorizontal: boolean,
}

export type Result = {
    barrage: string[],
    speed: number,
    channels: number,
    extraStyle: string,
    danmakuFullStyle: string,
    isHorizontal: boolean,
}
const exampleText = `我是
一个测试文本`
const model = reactive<Model>({
    content: exampleText,
    speed: 200,
    textSize: 100,
    textColor: '#FFFFFF',
    bgColor: '#000000',
    isHorizontal: false,
})
const isFullPlay = ref(false)
const addExample = () => {
    model.content = exampleText
}
const exitFullPlay = () => {
    try {
        danmuContainerFullscreen.exit();
        unlockOrientation();
    } catch (error) {
    }
    danmakuFullRef.value?.stop()
    isFullPlay.value = false
}
const fullPlay = () => {
    isFullPlay.value = true
    try {
        danmuContainerFullscreen.enter()
        lockOrientation("landscape-primary")
    } catch (error) {
    }
    danmakuFullRef.value?.stop()
    danmakuFullRef.value?.resize()
    danmakuFullRef.value?.play()
}
const danmakuFullRef = useTemplateRef('danmakuFull')
const danmuContainerRef = useTemplateRef('danmuContainer')
const {
    lockOrientation,
    unlockOrientation,
} = useScreenOrientation()
const danmuContainerFullscreen = useFullscreen(danmuContainerRef)
const formRef = useTemplateRef("form")
const message = useAnyMessage()
const result = computedAsync(async () => {
    let res: Result | undefined = undefined;
    const content = model.content;
    const textColor = model.textColor;
    const textSize = model.textSize;
    const bgColor = model.bgColor;
    const speed = model.speed;
    const isHorizontal = model.isHorizontal;

    try {
        await formRef.value?.validate();
        // const danmakuFullStyle = "z-index: 99; position: fixed; top: 0px; left: 0px; height:" + info.danmakuFullHeight + "; width:" + info.danmakuFullWidth + "; background-color:" + info.bgColor + ";" + danmakuStyleExt
        res = {
            barrage: [content],
            speed: speed,
            channels: 1,
            extraStyle: `
            color: ${textColor};
            font-size: ${textSize}px;
            user-select: none;
            `,
            danmakuFullStyle: `
            width: 100%;
            height: 100%;
            background-color: ${bgColor};
            `,
            isHorizontal,
        }
    } catch (error) {
        res = undefined;
        message.anyError(error)
    }
    return res;
})
watch(() => danmuContainerRef.value, (val) => {
    if (!val) return;
    new RegisterDbltouchEvent(val, (evt) => {
        exitFullPlay()
    })
})
</script>

<style lang="less" scoped>
.rotateToHorizontal {
    transform-origin: top left;
    transform: rotate(90deg) translateY(-100%);
    width: 100vh;
    height: 100vw;
}
</style>