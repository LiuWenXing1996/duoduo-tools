<template>
    <tool-item-wrapper>
        <template #input>
            <n-form :model="model">
                <tool-item-input-fieldset>
                    <template #label>
                        文本
                    </template>
                    <n-form-item path="version" first>
                        <template #label>
                            <div class="inline-flex">
                                <span>
                                    版本
                                </span>
                            </div>
                        </template>
                        <n-select :options="typeOptions" v-model:value="model.version"></n-select>
                    </n-form-item>
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
                    <template v-if="['v3', 'v5'].includes(model.version)">
                        <n-form-item path="options.namespace" first>
                            <template #label>
                                <div class="inline-flex">
                                    <span>
                                        命名空间
                                    </span>
                                </div>
                            </template>
                            <n-input v-model:value="model.options.namespace"></n-input>
                        </n-form-item>
                        <n-form-item path="options.name" first>
                            <template #label>
                                <div class="inline-flex">
                                    <span>
                                        名称
                                    </span>
                                </div>
                            </template>
                            <n-input v-model:value="model.options.name"></n-input>
                        </n-form-item>
                    </template>
                </tool-item-input-fieldset>
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
                                            name="material-symbols:content-copy" @click="handleCopy(text)" />
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
    </tool-item-wrapper>
</template>
<script lang="ts">
export type Model = {
    // version: "NIL" | "v1" | 'v3' | 'v4' | 'v5' | 'v6' | 'v7',
    version: "NIL" | "v1" | 'v3' | 'v4' | 'v5',
    count: number,
    options: {
        namespace: string,
        name: string
    }
}

</script>
<script setup lang="ts">
import copy from 'copy-to-clipboard';
import {
    NIL, v1, v3, v4, v5,
    v6, v7
} from "uuid"

defineOptions({
    toolMeta: defineToolMeta({
        title: 'UUID 生成',
        description: `支持生成各个版本的 UUID`,
        category: ToolCategory.text,
        related: [{
            title: 'IT-TOOLS - UUIDs 生成器',
            url: 'https://www.aiotools.top/uuid-generator'
        }]
    })
})
const message = useMessage()
const model = reactive<Model>({
    version: "v4",
    count: 5,
    options: {
        namespace: "",
        name: ""
    }
})
const typeOptions = defineSelectOptionList<Record<Model["version"], unknown>>({
    NIL: { label: "NIL" },
    v1: { label: "v1" },
    v3: { label: "v3" },
    v4: { label: "v4" },
    v5: { label: "v5" },
    // TODO: 支持v6 和 v7
    // v6: { label: "v6" },
    // v7: { label: "v7" },
})
const refreshTag = ref(false);
const handleRefresh = () => {
    refreshTag.value = !refreshTag.value
}
const res = computed(() => {
    const refreshEmptyStr = refreshTag.value ? "" : "";
    const type = model.version;
    const name = model.options.name + refreshEmptyStr;
    const namespace = model.options.namespace;
    const methods: Record<Model["version"], (index: number) => string> = {
        NIL: () => NIL,
        v1: (index) => {
            return v1({
                clockseq: index,
                msecs: Date.now(),
                nsecs: Math.floor(Math.random() * 10000),
                node: new Uint8Array(Array.from({ length: 6 }, () => Math.floor(Math.random() * 256)))
            })
        },
        v3: () => v3(name, namespace),
        v4: () => v4(),
        v5: () => v5(name, namespace),
        // v6: (index) => {
        //     return v6({
        //         clockseq: index,
        //         msecs: Date.now(),
        //         nsecs: Math.floor(Math.random() * 10000),
        //         node: new Uint8Array(Array.from({ length: 6 }, () => Math.floor(Math.random() * 256)))
        //     })
        // },
        // v7: (index) => {
        //     return v7({
        //         msecs: Date.now(),
        //     })
        // }
    }
    const ids: string[] = []
    const count = model.count;
    for (let index = 0; index < count; index++) {
        const gen = () => {
            try {
                const method = methods[type] || (() => "");
                return method(index)
            } catch (error) {
                console.log(error)
                return ""
            }
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