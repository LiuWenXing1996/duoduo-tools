<template>
    <define-tool-wrapper>
        <template #input>
            <n-form :model="model">
                <define-tool-area label="基础">
                    <n-form-item path="text" first>
                        <template #label>
                            <div class="inline-flex">
                                <span>
                                    行
                                </span>
                            </div>
                        </template>
                        <n-input-number v-model:value="model.row" :min="1" />
                    </n-form-item>
                    <n-form-item path="text" first>
                        <template #label>
                            <div class="inline-flex">
                                <span>
                                    列
                                </span>
                            </div>
                        </template>
                        <n-input-number v-model:value="model.col" :min="1" />
                    </n-form-item>
                </define-tool-area>
                <define-tool-area label="绘制">
                    <n-form-item path="bgColor" first>
                        <template #label>
                            <div class="inline-flex">
                                <span>
                                    背景色
                                </span>
                            </div>
                        </template>
                        <n-color-picker v-model:value="model.bgColor" :render-label="() => ''"></n-color-picker>
                    </n-form-item>
                    <n-form-item path="resolution.isDraw" first>
                        <template #label>
                            <div class="inline-flex">
                                <span>
                                    解决路径
                                </span>
                            </div>
                        </template>
                        <n-switch v-model:value="model.resolution.isDraw"></n-switch>
                    </n-form-item>
                    <n-form-item path="resolution.color" first v-if="model.resolution.isDraw">
                        <template #label>
                            <div class="inline-flex">
                                <span>
                                    解决路径颜色
                                </span>
                            </div>
                        </template>
                        <n-color-picker v-model:value="model.resolution.color"
                            :render-label="() => ''"></n-color-picker>
                    </n-form-item>
                    <n-form-item path="wall.isDraw" first>
                        <template #label>
                            <div class="inline-flex">
                                <span>
                                    墙
                                </span>
                            </div>
                        </template>
                        <n-switch v-model:value="model.wall.isDraw"></n-switch>
                    </n-form-item>
                    <n-form-item path="wall.color" first v-if="model.wall.isDraw">
                        <template #label>
                            <div class="inline-flex">
                                <span>
                                    墙颜色
                                </span>
                            </div>
                        </template>
                        <n-color-picker v-model:value="model.wall.color" :render-label="() => ''"></n-color-picker>
                    </n-form-item>
                    <n-form-item path="point.isDraw" first>
                        <template #label>
                            <div class="inline-flex">
                                <span>
                                    点位
                                </span>
                            </div>
                        </template>
                        <n-switch v-model:value="model.point.isDraw"></n-switch>
                    </n-form-item>
                    <n-form-item path="point.color" first v-if="model.point.isDraw">
                        <template #label>
                            <div class="inline-flex">
                                <span>
                                    点位颜色
                                </span>
                            </div>
                        </template>
                        <n-color-picker v-model:value="model.point.color" :render-label="() => ''"></n-color-picker>
                    </n-form-item>
                </define-tool-area>
            </n-form>
        </template>
        <template #output>
            <div v-show="isShowScale.content.value" class="absolute top-0 right-[10px] z-10">
                <n-tag>放缩比: {{ scale.toFixed(1) }}</n-tag>
            </div>
            <div :style="{ zoom: scale }">
                <div class="w-fit">
                    <canvas width="100" height="100" ref="resCanvasRef"></canvas>
                </div>
            </div>
        </template>
        <template #actions>
            <n-space>
                <n-button size="small" @click="gen">生成</n-button>
                <n-dropdown trigger="click" :options="downloadFileTypeOptions" @select="handleDownload">
                    <n-button size="small">
                        下载迷宫图片
                    </n-button>
                </n-dropdown>
                <n-button size="small" @click="scaleAdd">放大</n-button>
                <n-button size="small" @click="scaleSub">缩小</n-button>
            </n-space>
        </template>
    </define-tool-wrapper>
</template>
<script lang="ts">
export enum FileExtension {
    "png" = "png",
    "jpeg" = "jpeg",
    "webp" = "webp"
}

export type Model = {
    row: number,
    col: number,
    bgColor: string,
    wall: {
        isDraw: boolean,
        color: string
    },
    point: {
        isDraw: boolean,
        color: string
    },
    resolution: {
        isDraw: boolean,
        color: string
    },
}
</script>
<script setup lang="ts">
import type { Maze } from '~/composables/use-maze';

defineOptions({
    toolMeta: defineToolMeta({
        title: '迷宫生成',
        description: `一个简单的迷宫生成器`,
        category: ToolCategory.picture,
    })
})

const maze = useMaze()
const resCanvas = useTemplateRef("resCanvasRef")
const model = reactive<Model>({
    row: 15,
    col: 15,
    bgColor: "#fff",
    wall: {
        isDraw: true,
        color: "#000"
    },
    point: {
        isDraw: false,
        color: '#000'
    },
    resolution: {
        isDraw: true,
        color: '#00f'
    }
})
const currentMaze = shallowRef<Maze>()
const gen = () => {
    const m = maze.gen({
        row: model.row,
        col: model.col
    })
    if (resCanvas.value) {
        m.draw(resCanvas.value, {
            bgColor: model.bgColor,
            wall: model.wall,
            point: model.point,
            resolution: model.resolution,
        })
    }
    currentMaze.value = m
}

const isShowScale = useAutoBoolean()
const scale = ref(1)
const scaleAdd = () => {
    scale.value = scale.value + 0.1;
    isShowScale.toggle();
}

const scaleSub = () => {
    const newVal = scale.value - 0.1;
    if (newVal <= 0.1) {
        scale.value = 0.1
    } else {
        scale.value = newVal
    }
    isShowScale.toggle();
}


const typeMap: Record<FileExtension, string> = {
    [FileExtension.jpeg]: "image/jpeg",
    [FileExtension.png]: "image/png",
    [FileExtension.webp]: "image/webp",
}

const downloadFileTypeOptions = defineSelectOptionList<Record<FileExtension, unknown>>({
    [FileExtension.jpeg]: { label: "jpeg" },
    [FileExtension.png]: { label: "png" },
    [FileExtension.webp]: { label: "webp" },
})

const handleDownload = async (val: FileExtension) => {
    console.log(val)
    const mimeType = typeMap[val]
    const url = resCanvas.value?.toDataURL(mimeType);
    if (url) {
        downloadURI(url, `maze.${val}`);
    }
}

watch([
    () => model.bgColor,
    () => toRefs(model.wall),
    () => toRefs(model.point),
    () => toRefs(model.resolution),
], () => {
    if (resCanvas.value) {
        currentMaze.value?.draw(resCanvas.value, {
            bgColor: model.bgColor,
            wall: model.wall,
            point: model.point,
            resolution: model.resolution,
        })
    }
})
</script>