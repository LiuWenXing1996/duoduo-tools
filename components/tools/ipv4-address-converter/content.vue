<template>
    <tool-content>
        <template #input>
            <n-form ref="form" :model="model">
                <tool-area label="配置">
                    <n-form-item :="commonFormItemProps" path="content" label="类型" :rule="[
                        { required: true, message: '请输入 IPv4 地址', trigger: allFormItemTrigger },
                        {
                            validator: (_, val) => {
                                if (isValidIpv4({ ip: val })) {
                                    return true
                                } else {
                                    return false
                                }
                            }, message: '请输入正确的 IPv4 地址', trigger: allFormItemTrigger
                        }
                    ]">
                        <template #label>
                            <tool-label label="IPv4 地址" :actions="[
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
                    const value = resRequest.data.value?.ipv4 || ''
                    return {
                        label: 'IPv4 地址',
                        value,
                        valueActions: [commonCopyAction(value)]
                    }
                },
                () => {
                    const value = resRequest.data.value?.decimal || ''
                    return {
                        label: '十进制',
                        value,
                        valueActions: [commonCopyAction(value)]
                    }
                },
                () => {
                    const value = resRequest.data.value?.binary || ''
                    return {
                        label: '二进制',
                        value,
                        valueActions: [commonCopyAction(value)]
                    }
                },
                () => {
                    const value = resRequest.data.value?.hex || ''
                    return {
                        label: '十六进制',
                        value,
                        valueActions: [commonCopyAction(value)]
                    }
                },
                () => {
                    const value = resRequest.data.value?.ipv6 || ''
                    return {
                        label: 'IPv6 地址',
                        value,
                        valueActions: [commonCopyAction(value)]
                    }
                },
                () => {
                    const value = resRequest.data.value?.ipv6Short || ''
                    return {
                        label: 'IPv6 地址(简写)',
                        value,
                        valueActions: [commonCopyAction(value)]
                    }
                },
            ]" />
        </template>
    </tool-content>
</template>

<script setup lang="tsx">
import _ from 'lodash'
export type Model = {
    content: string,
}

export type Result = {
    ipv4: string,
    decimal: string,
    binary: string,
    hex: string,
    ipv6: string,
    ipv6Short: string,
}
const model = reactive<Model>({
    content: ""
})
const addExample = () => {
    model.content = "192.168.1.1"
}
onMounted(() => {
    addExample()
})
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
        }
    }
}
const formRef = useTemplateRef("form")
const resRequest = useCustomRequest<Result | undefined>(async () => {
    let res: Result | undefined = undefined;
    try {
        await formRef.value?.validate();
        const ipv4 = model.content;
        const decimal = ipv4ToInt({ ip: ipv4 }).toString();
        res = {
            ipv4,
            decimal: decimal,
            binary: convertIntegerBase({ value: decimal, fromBase: 10, toBase: 2 }),
            hex: convertIntegerBase({ value: decimal, fromBase: 10, toBase: 16 }),
            ipv6: ipv4ToIpv6({ ip: ipv4 }),
            ipv6Short: ipv4ToIpv6({ ip: ipv4, prefix: '::ffff:' }),
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
const isValidIpv4 = ({ ip }: { ip: string }) => {
    if (!ip) {
        return false;
    }
    const cleanIp = ip.trim();

    return /^((25[0-5]|(2[0-4]|1\d|[1-9]|)\d)\.?\b){4}$/.test(cleanIp);
}
const ipv4ToInt = ({ ip }: { ip: string }) => {
    if (!isValidIpv4({ ip })) {
        return 0;
    }

    return ip
        .trim()
        .split('.')
        .reduce((acc, part, index) => acc + Number(part) * 256 ** (3 - index), 0);
}
const ipv4ToIpv6 = ({ ip, prefix = '0000:0000:0000:0000:0000:ffff:' }: { ip: string; prefix?: string }) => {
    if (!isValidIpv4({ ip })) {
        return '';
    }

    return (
        prefix
        + _.chain(ip)
            .trim()
            .split('.')
            .map(part => Number.parseInt(part).toString(16).padStart(2, '0'))
            .chunk(2)
            .map(blocks => blocks.join(''))
            .join(':')
            .value()
    );
}
watch(() => model, () => {
    resRequest.run()
}, {
    immediate: true,
    deep: true
})

</script>