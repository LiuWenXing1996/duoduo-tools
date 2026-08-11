<template>
    <tool-content :vertical="{
        enabled: true,
        top: {
            class: '!h-[20%]'
        },
        bottom: {
            class: '!h-[80%]'
        }
    }" :output="{
        scroll: {
            disabled: true
        },
        area: {
            label: '随机数'
        }
    }">
        <template #output>
            <div class="flex flex-col size-full">
                <div class="-mt-[20px]  ">
                    <n-form ref="form" :model="model" class="justify-center" inline :show-feedback="false">
                        <n-form-item :="commonFormItemProps" path="min">
                            <n-input-number v-model:value="model.min" :step="1" />
                        </n-form-item>
                        <n-form-item :="commonFormItemProps" path="max">
                            <n-input-number v-model:value="model.max" :step="1" />
                        </n-form-item>
                    </n-form>
                </div>
                <div class="h-[150px] flex items-center justify-center">
                    <div class="text-5xl h-24 leading-[6rem]" v-if="result?.content">
                        {{ result.content }}
                    </div>
                </div>
                <div class="h-[calc(100%-150px)]">
                    <n-card class="size-full" size="small">
                        <template #header>
                            <span>历史记录</span>
                        </template>
                        <template #header-extra>
                            <n-space>
                                <icon-button name="common-clear" @click="() => { history = [] }" tooltip="清空历史" />
                                <icon-button name="common-copy" @click="() => { copyHistory() }" tooltip="复制历史" />
                            </n-space>
                        </template>
                        <custom-scrollbar>
                            <n-space>
                                <n-tag :bordered="false" :type="item ? 'success' : 'default'" v-for="item in history">
                                    <div class="font-mono">
                                        {{ item }}
                                    </div>
                                </n-tag>
                            </n-space>
                        </custom-scrollbar>
                    </n-card>
                </div>
            </div>
        </template>
        <template #actions>
            <n-space>
                <n-button size="small" :disabled="chooseStatus" @click="resRequest.run">生成</n-button>
            </n-space>
        </template>
    </tool-content>
</template>

<script setup lang="tsx">
import { random } from 'radash'

export type Model = {
    min: number,
    max: number,
}
export type Result = {
    content: number,
}
const copy = useCopy();
const history = ref<number[]>([]);
const result = ref<Result | undefined>({
    content: 1
})
const copyHistory = () => {
    const rawList = history.value || [];
    const formattedList = rawList.map(e => e.toString());
    copy(formattedList.join(','));
}
const model = reactive<Model>({
    min: 0,
    max: 100,
})
const chooseStatus = ref(false)
const choose = async (): Promise<number | undefined> => {
    if (chooseStatus.value) {
        return result.value?.content
    }
    chooseStatus.value = true
    return new Promise((resolve, reject) => {
        let count = 0
        const chooseInterval = setInterval(() => {
            const currentScope = random(model.min, model.max)
            result.value = {
                content: currentScope
            }
            count++
            if (count > 10) {
                clearTimeout(chooseInterval)
                chooseStatus.value = false
                resolve(currentScope)
            }
        }, 50)
    })
}

const resRequest = useCustomRequest<Result | undefined>(async () => {
    let res: Result | undefined = undefined;
    try {
        const content = await choose();
        if (content != undefined) {
            res = {
                content: content
            }
            history.value.push(content)
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

</script>