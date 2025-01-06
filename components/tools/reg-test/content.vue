<template>
    <tool-content>
        <template #input>
            <n-form ref="form" :model="model">
                <tool-area label="配置">
                    <n-form-item :="commonFormItemProps" path="regStr">
                        <template #label>
                            <tool-label label="正则" />
                        </template>
                        <n-input type="textarea" :rows="2" clearable v-model:value="model.regStr" />
                    </n-form-item>
                    <n-form-item :="commonFormItemProps" path="isCase" label="是否忽略大小写">
                        <n-switch v-model:value="model.isCase" />
                    </n-form-item>
                    <n-form-item :="commonFormItemProps" path="isAll" label="是否匹配全部">
                        <n-switch v-model:value="model.isAll" />
                    </n-form-item>
                    <n-form-item :="commonFormItemProps" path="content">
                        <template #label>
                            <tool-label label="内容" :actions="[
                                {
                                    name: 'common-demo',
                                    tooltip: '使用示例',
                                    onClick: () => {
                                        model.content = testStr
                                    }
                                }
                            ]" />
                        </template>
                        <n-input type="textarea" :rows="4" clearable v-model:value="model.content" />
                    </n-form-item>
                </tool-area>
                <tool-area label="常用正则">
                    <n-space>
                        <n-button size="small" @click="() => {
                            model.regStr = item.value
                        }" v-for="item in regList" :key="item.value">
                            {{ item.label }}
                        </n-button>
                    </n-space>
                </tool-area>
            </n-form>
        </template>
        <template #output>
            <common-key-value :item-label-width="70" :data="[
                {
                    label: '匹配数量',
                    value: (resRequest.data?.value?.matchNum || 0).toString()
                },
                {
                    label: '匹配结果',
                    value: resRequest.data?.value?.matchRes || ''
                }
            ]" />
        </template>
    </tool-content>
</template>

<script setup lang="tsx">

export type Model = {
    content: string,
    regStr: string,
    isCase: boolean,
    isAll: boolean,
}

export type Result = {
    matchNum: number,
    matchRes: string,
}
const model = reactive<Model>({
    content: "",
    regStr: "",
    isCase: false,
    isAll: true,
})

onMounted(() => {
    model.content = testStr
    model.regStr = regList[0].value
})
const regList: {
    label: string,
    value: string
}[] = [
        {
            label: "邮箱",
            value: "\\w+([-+.]\\w+)*@\\w+([-.]\\w+)*\\.\\w+([-.]\\w+)*"
        },
        {
            label: "手机号",
            value: "1[3-9]\\d{9}"
        },
        {
            label: "url",
            value: "(https?|ftp|file)://[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]"
        },
        {
            label: "IP",
            value: "(?:(?:25[0-5]|2[0-4]\\d|[01]?\\d?\\d)\\.){3}(?:25[0-5]|2[0-4]\\d|[01]?\\d?\\d)"
        },
        {
            label: "时间",
            value: "\\d{4}-\\d{2}-\\d{2}"
        },
    ];
const testStr = `一些测试实例:
邮箱1：demo@163.com
邮箱2：demo2@163.com
手机号：13012341234
url: http://tools.ranblogs.com、https://ranblogs.com
IP: 192.168.0.1
时间：2023-11-24`

const formRef = useTemplateRef("form")
const resRequest = useCustomRequest<Result | undefined>(async () => {
    let res: Result | undefined = undefined;
    try {
        await formRef.value?.validate();
        const isAll = model.isAll
        const isCase = model.isCase
        let rule = ''
        rule = isAll ? 'g' : ''
        rule += isCase ? 'i' : ''
        let reg = new RegExp(model.regStr, rule)
        let matchArr = model.content.match(reg)
        if (isAll) {
            if (matchArr?.length) {
                res = {
                    matchNum: matchArr.length,
                    matchRes: matchArr.join('\n')
                }
            }
        } else {
            if (matchArr?.[0]) {
                res = {
                    matchNum: 1,
                    matchRes: matchArr[0]
                }
            }
        }
    } catch (error) {
        resRequest.mutate(undefined)
        throw error
    }
    return res;
}, {
    loadingKeep: 0,
    debounceOptions: {
        leading: false
    }
})
watch(() => model, () => {
    resRequest.run()
}, {
    immediate: true,
    deep: true
})

</script>