<template>
    <define-tool-wrapper>
        <template #input>
            <n-form :model="model">
                <define-tool-area label="配置">
                    <n-form-item path="count" first>
                        <template #label>
                            <div class="inline-flex">
                                <span>
                                    数量
                                </span>
                            </div>
                        </template>
                        <n-input-number v-model:value="model.count" :min="1" :step="1"></n-input-number>
                    </n-form-item>
                </define-tool-area>
            </n-form>
        </template>
        <template #output>
            <n-descriptions label-placement="left" :column="1" label-class="w-[30px] inline-flex"
                content-class="w-[calc(100%-30px)]">
                <n-descriptions-item v-for="(text, index) in res">
                    <template #label>
                        <div class="inline-flex">
                            <span class="font-medium">
                                {{ index + 1 }}
                            </span>
                        </div>
                    </template>
                    <div class="inline-flex" v-if="text">
                        <span class=" break-all">
                            {{ text }}
                            <n-tooltip trigger="hover">
                                <template #trigger>
                                    <div class=" inline-flex">
                                        <svg-icon class="ml-[2px] pb-[5px] text-[12px] cursor-pointer"
                                            name="common-copy" @click="handleCopy(text)" />
                                    </div>
                                </template>
                                {{ `点击复制` }}
                            </n-tooltip>
                        </span>

                    </div>
                </n-descriptions-item>
            </n-descriptions>
        </template>
        <template #actions>
            <n-space>
                <n-button size="small" @click="handleCopyAll">复制所有</n-button>
                <n-button size="small" @click="handleRefresh">重新生成</n-button>
            </n-space>
        </template>
    </define-tool-wrapper>
</template>

<script setup lang="ts">
import copy from 'copy-to-clipboard';
import { ulid } from "ulid"

export type Model = {
    count: number,
}

const message = useMessage()
const model = reactive<Model>({
    count: 5,
})

const refreshTag = ref(false);
const handleRefresh = () => {
    refreshTag.value = !refreshTag.value
}
const res = computed(() => {
    const refreshEmptyStr = refreshTag.value ? "" : "";

    const ids: string[] = filterNullable([refreshEmptyStr])
    const count = model.count;
    for (let index = 0; index < count; index++) {
        const gen = () => {
            return ulid()
        }
        ids.push(gen())
    }
    return ids
})
const handleCopy = (val: string) => {
    const res = copy(val);
    if (res) {
        message.success("复制成功")
    } else {
        message.error("复制失败")
    }
}

const handleCopyAll = () => {
    const val = res.value.join("\n");
    const copyRes = copy(val);
    if (copyRes) {
        message.success("复制成功")
    } else {
        message.error("复制失败")
    }
}
</script>