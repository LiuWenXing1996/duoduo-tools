<template>
    <tool-content>
        <template #input>
            <n-form ref="form" :model="model">
                <tool-area label="配置">
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
                        <n-input type="textarea" :rows="10" clearable v-model:value="model.content" />
                    </n-form-item>
                </tool-area>
            </n-form>
        </template>
        <template #output>
            <div class="text-5xl h-24 leading-[6rem]" v-if="result?.content">
                {{ result.content }}
            </div>
        </template>
        <template #actions>
            <n-space>
                <n-button size="small" :disabled="chooseStatus" @click="resRequest.run">开始决定</n-button>
                <n-button size="small" @click="copy(result?.content)">复制结果</n-button>
            </n-space>
        </template>
    </tool-content>
</template>

<script setup lang="tsx">

export type Model = {
    content: string,
}

export type Result = {
    content: string,
}
const exampleText = "沙县,烧腊,小炒肉,兰州拉面,汤饭,黄焖鸡,卤肉饭,蛋炒饭,羊肉粉,螺蛳粉,猪脚饭,白切鸡,肯德基,火锅,烧烤,泡面,西北风,煎饼果子"
const model = reactive<Model>({
    content: exampleText
})
const addExample = () => {
    model.content = exampleText
}
const copy = useCopy()
const chooseStatus = ref(false)
const choose = async (): Promise<string | undefined> => {
    if (chooseStatus.value) {
        return
    }
    chooseStatus.value = true
    return new Promise((resolve, reject) => {
        let count = 0
        let scopeList = model.content.split(',')
        const chooseInterval = setInterval(() => {
            const randomNum = Math.floor(Math.random() * scopeList.length);
            const currentScope = scopeList[randomNum]
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
const result = ref<Result | undefined>()
const formRef = useTemplateRef("form");
const resRequest = useCustomRequest<Result | undefined>(async () => {
    let res: Result | undefined = undefined;
    try {
        await formRef.value?.validate();
        const content = await choose();
        res = {
            content: content || ""
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