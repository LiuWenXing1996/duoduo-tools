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
                        <n-input clearable v-model:value="model.content" />
                    </n-form-item>
                </tool-area>
            </n-form>
        </template>
        <template #output>
            <key-value :data="[
                () => {
                    const value = resRequest.data.value?.content?.toString() || ''
                    return {
                        label: '子网掩码',
                        value: value,
                        valueActions: [commonCopyAction(value)]
                    }
                },
                () => {
                    const value = resRequest.data.value?.content?.base || ''
                    return {
                        label: '网络地址',
                        value,
                        valueActions: [commonCopyAction(value)]
                    }
                },
                () => {
                    const value = resRequest.data.value?.content?.mask || ''
                    return {
                        label: '网络掩码',
                        value,
                        valueActions: [commonCopyAction(value)]
                    }
                },
                () => {
                    const value = bitmaskToDisplay(resRequest.data.value?.content?.bitmask)
                    return {
                        label: '网络掩码（二进制）',
                        value,
                        valueActions: [commonCopyAction(value)]
                    }
                },
                () => {
                    const value = resRequest.data.value?.content?.bitmask ? `/${resRequest.data.value.content.bitmask}` : ''
                    return {
                        label: 'CIDR 标记',
                        value,
                        valueActions: [commonCopyAction(value)]
                    }
                },
                () => {
                    const value = resRequest.data.value?.content?.hostmask || ''
                    return {
                        label: '通配符掩码',
                        value,
                        valueActions: [commonCopyAction(value)]
                    }
                },
                () => {
                    const value = resRequest.data.value?.content?.size?.toString() || ''
                    return {
                        label: '网络大小',
                        value,
                        valueActions: [commonCopyAction(value)]
                    }
                },
                () => {
                    const value = resRequest.data.value?.content?.first || ''
                    return {
                        label: '起始地址',
                        value,
                        valueActions: [commonCopyAction(value)]
                    }
                },
                () => {
                    const value = resRequest.data.value?.content?.last || ''
                    return {
                        label: '结束地址',
                        value,
                        valueActions: [commonCopyAction(value)]
                    }
                },
                () => {
                    const value = resRequest.data.value?.content?.broadcast || ''
                    return {
                        label: '广播地址',
                        value,
                        valueActions: [commonCopyAction(value)]
                    }
                },
                () => {
                    const value = getIPClass(resRequest.data.value?.content?.base)
                    return {
                        label: 'IP 类别',
                        value,
                        valueActions: [commonCopyAction(value)]
                    }
                }
            ]" />
        </template>
    </tool-content>
</template>

<script setup lang="tsx">
import { Netmask } from 'netmask';
export type Model = {
    content: string,
}

export type Result = {
    content: Netmask,
}
const model = reactive<Model>({
    content: ""
})
const addExample = () => {
    model.content = "192.168.0.1/24"
}
const copy = useCopy()
onMounted(() => {
    addExample()
})
const commonCopyAction = (content: string): IconButtonComponentProps | undefined => {
    if (!content) {
        return undefined
    }
    return {
        name: 'common-copy',
        onClick: () => {
            copy(content)
        },
    }
}
const formRef = useTemplateRef("form")
const resRequest = useCustomRequest<Result | undefined>(async () => {
    let res: Result | undefined = undefined;
    try {
        await formRef.value?.validate();
        const block = new Netmask(model.content)
        res = {
            content: block
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
const bitmaskToDisplay = (bitmask: number | undefined) => {
    if (!bitmask) {
        return ''
    }
    const res = ('1'.repeat(bitmask) + '0'.repeat(32 - bitmask)).match(/.{8}/g)?.join('.');
    return res ?? ''
}
const getIPClass = (ip: string | undefined) => {
    if (!ip) {
        return ""
    }
    const [firstOctet] = ip.split('.').map(Number);

    if (firstOctet < 128) {
        return 'A';
    }
    if (firstOctet > 127 && firstOctet < 192) {
        return 'B';
    }
    if (firstOctet > 191 && firstOctet < 224) {
        return 'C';
    }
    if (firstOctet > 223 && firstOctet < 240) {
        return 'D';
    }
    if (firstOctet > 239 && firstOctet < 256) {
        return 'E';
    }

    return "";
}
watch(() => model, () => {
    resRequest.run()
}, {
    immediate: true,
    deep: true
})

</script>