<template>
    <tool-wrapper :vertical="{
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
            <common-group :data="result" :config="{
                list: {
                    bordered: true
                }
            }">
                <template #item="item">
                    <common-group-list :item-label-width="50" :data="item.groupList" />
                </template>
            </common-group>
        </template>
        <template #actions>
            <n-input placeholder="搜索状态码" v-model:value="searchKey"></n-input>
        </template>
    </tool-wrapper>
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

const result: ComputedRef<CommonGroupComponentProps<{
    groupList: CommonGroupListComponentProps['data']
}>['data']> = computed(() => {
    const rawGroup = group(httpCodeListSearched.value, e => e.group);

    const groups: CommonGroupComponentProps<{
        groupList: CommonGroupListComponentProps['data']
    }>['data'] = Object.entries(HttpCodeGroupDisplayMap)
        .map(([key, val]) => {
            const rawItems = rawGroup[key as HttpCodeGroup] || []
            const groupList: CommonGroupListComponentProps['data'] = rawItems
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
                content: {
                    groupList
                }
            }
        })

    return groups
})
</script>