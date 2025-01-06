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
            label: '列表'
        },
    }" :actions="{
        area: {
            label: '搜索'
        }
    }">
        <template #output>
            <n-list bordered>
                <n-list-item v-for="groupItem in result.group" class="!p-[10px]">
                    <n-thing content-style="margin-top: 0px;">
                        <template #header>
                            <rich-text :content="groupItem.label" />
                        </template>
                        <n-list hoverable clickable>
                            <n-list-item v-for="listItem in groupItem.list" class="!p-[10px]">
                                <n-thing content-class="ml-[10px] !mt-[5px]">
                                    <template #header>
                                        <rich-text :content="listItem.label" />
                                    </template>
                                    <key-value :item-label-width="50" :data="listItem.items" />
                                </n-thing>
                            </n-list-item>
                        </n-list>
                    </n-thing>
                </n-list-item>
            </n-list>
        </template>
        <template #actions>
            <n-input placeholder="搜索状态码" v-model:value="searchKey"></n-input>
        </template>
    </tool-content>
</template>
<script setup lang="tsx">
import { group } from "radash";
import { httpCodeList, HttpCodeGroupDisplayMap, HttpCodeGroup } from "./utils"
import { NButton } from "naive-ui";

const searchKey = ref("");

const httpCodeListSearched = computed(() => {
    const searchKeyVal = searchKey.value;
    if (!searchKeyVal) {
        return [...httpCodeList]
    }
    const list = httpCodeList.filter(e => {
        if (e.code.toString().includes(searchKeyVal)) {
            return true
        }
        if (e.enName.includes(searchKeyVal)) {
            return true
        }

        return false
    })

    return list
})

export type Result = {
    group: {
        label: string,
        list: {
            label: string,
            items: KeyValueComponentProps['data']
        }[]
    }[]
}

const result: ComputedRef<Result> = computed(() => {
    const rawGroup = group(httpCodeListSearched.value, e => e.group);

    const data = Object.entries(HttpCodeGroupDisplayMap)
        .map(([key, val]) => {
            const rawItems = rawGroup[key as HttpCodeGroup] || []
            const data = rawItems
                .map((httpCode) => {
                    return {
                        label: `${httpCode.code} (${httpCode.enName})`,
                        items: [
                            {
                                label: "描述",
                                value: httpCode.description
                            },
                            {
                                label: "MDN",
                                value: () => {
                                    const href = httpCode.mdnUrl || `https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Status/${httpCode.code}`
                                    return <span>
                                        <NButton text
                                            tag="a"
                                            // @ts-ignore
                                            href={href}
                                            target="_blank"
                                            type="primary">
                                            MDN文档
                                        </NButton>
                                    </span>
                                }
                            }
                        ]
                    }
                })
            return {
                label: val.label,
                list: data
            }
        })

    return {
        group: data
    }
})

</script>