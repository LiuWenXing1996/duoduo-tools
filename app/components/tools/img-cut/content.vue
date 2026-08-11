<template>
    <tool-content :output="{
        scroll: {
            disabled: false,
        }
    }">
        <template #input>
            <n-form ref="form" :model="model">
                <tool-area label="配置">
                    <n-form-item :="commonFormItemProps" path="row" label="行数">
                        <n-input-number v-model:value="model.row" :min="1" :max="100" :step="1" />
                    </n-form-item>
                    <n-form-item :="commonFormItemProps" path="col" label="列数">
                        <n-input-number v-model:value="model.col" :min="1" :max="100" :step="1" />
                    </n-form-item>
                    <n-form-item :="commonFormItemProps" path="img">
                        <template #label>
                            <tool-label label="图片" :actions="[
                                {
                                    name: 'common-demo',
                                    onClick: addExample,
                                }
                            ]" />
                        </template>
                        <n-upload v-model:file-list="fileList" list-type="image-card" :max="1" />
                    </n-form-item>
                </tool-area>
            </n-form>
        </template>
        <template #output>
            <div class="img-list">
                <template v-for="item in resRequest.data.value?.list">
                    <div class="relative img-item">
                        <img v-if="item.imgDataUrl" :src="item.imgDataUrl" class="min-w-full min-h-full" />
                        <div class="img-download absolute top-0 bottom-0 left-0 right-0 flex items-center justify-center bg-primaryActiveBg"
                            @click="downloadImg(item)">
                            <svg-icon name="common-download" :size="30" />
                        </div>
                    </div>
                </template>
            </div>
        </template>
        <template #actions>
            <n-space>
                <n-button size="small" @click="downloadAll">下载全部</n-button>
            </n-space>
        </template>
    </tool-content>
</template>

<script setup lang="tsx">
import type { UploadFileInfo } from 'naive-ui'
import { imgCut, type ImgCutResultItem } from './utils'


export type Model = {
    image: string,
    row: number,
    col: number,
}

export type Result = {
    list: ImgCutResultItem[],
}
const model = reactive<Model>({
    image: "",
    row: 3,
    col: 3,
})
const fileList = ref<UploadFileInfo[]>([])
watch(fileList, async () => {
    const file = fileList.value[0]?.file
    let text = ""
    if (file) {
        text = await toBase64(file) || ""
    }
    model.image = text
}, { immediate: true })
const toBase64 = (file: File) => new Promise<string | null>((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string | null);
    reader.onerror = reject;
});
const exampleText = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyMDAgMjAwIiB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCI+CiAgPHJlY3Qgd2lkdGg9IjIwMCIgaGVpZ2h0PSIyMDAiIGZpbGw9IiNjY2NjY2MiPjwvcmVjdD4KICA8dGV4dCB4PSI1MCUiIHk9IjUwJSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZm9udC1mYW1pbHk9Im1vbm9zcGFjZSIgZm9udC1zaXplPSIyMHB4IiBmaWxsPSIjMzMzMzMzIj4yMDB4MjAwPC90ZXh0PiAgIAo8L3N2Zz4="

const addExample = () => {
    fileList.value = [{
        id: "1",
        status: 'finished',
        name: "example.png",
        file: dataURLtoFile(exampleText, "example.png"),
    }]
    model.image = exampleText
}
const formRef = useTemplateRef("form")
const resRequest = useCustomRequest<Result | undefined>(async () => {
    let res: Result | undefined = undefined;
    try {
        await formRef.value?.validate();
        const imgList = await imgCut({
            imgDataUrl: model.image,
            row: model.row,
            col: model.col,
        })
        res = {
            list: imgList
        }
    } catch (error) {
        resRequest.mutate(undefined)
        throw error
    }
    return res;
}, {
    loadingKeep: 0,
    debounceOptions: {
        leading: true
    }
})
watch(() => model, () => {
    resRequest.run()
}, {
    immediate: true,
    deep: true
})
const gridTemplateColumns = computed(() => {
    return `repeat(${model.col}, 1fr)`
})
const gridTemplateRows = computed(() => {
    return `repeat(${model.row}, 1fr)`
})
const downloadImg = (item: ImgCutResultItem) => {
    downloadURL(item.imgDataUrl, `切图-${item.row}-${item.col}.png`)
}
const downloadAll = () => {
    resRequest.data.value?.list.forEach((item) => {
        downloadImg(item)
    })
}
</script>
<style lang="less" scoped>
.img-list {
    display: grid;
    grid-row-gap: 5px;
    grid-column-gap: 5px;
    grid-template-columns: v-bind(gridTemplateColumns);
    grid-template-rows: v-bind(gridTemplateRows);

    .img-item {
        cursor: pointer;

        :deep(> .img-download) {
            display: none;
        }

        &:hover {
            :deep(> .img-download) {
                display: flex;
            }
        }
    }
}
</style>