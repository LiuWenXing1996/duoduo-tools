<template>
    <define-tool-wrapper>
        <template #input>
            <n-form ref="formRef" :model="model" :rules="rules">
                <define-tool-area label="头部(Header)">
                    <n-form-item label="加密算法(alg)" path="data.header.alg" first>
                        <n-select :options="algorithmOptions" v-model:value="model.data.header.alg" />
                    </n-form-item>
                    <n-form-item label="类型(typ)" path="data.header.typ" first>
                        <n-input disabled v-model:value="model.data.header.typ" />
                    </n-form-item>
                    <common-empty-form-item label="自定义数据" :show-feedback="(model.data.custom?.header || []).length > 0"
                        :actions="[
                            {
                                type: IconButtonType['form-label-action'],
                                shortcut: {
                                    'icon.name': 'common-add',
                                    'button.onClick': () => {
                                        customHeaderHandler.addNew()
                                    },
                                    'tooltipWrapper.content': '添加',
                                    'tooltipWrapper.enabled': true
                                }
                            },
                        ]">
                        <div v-for="(item, index) in model.data.custom?.header || []"
                            class="flex w-full ml-[10px] mb-[10px] last:mb-[0px]">
                            <div class="flex w-[calc(100%-40px)]">
                                <div class="w-[50%] mr-[10px]">
                                    <n-form-item label="名称" :show-label="true" label-placement="left" :label-style="{
                                        alignItems: 'center'
                                    }" :show-feedback="false" :path="`data.custom.header[${index}].key`">
                                        <n-input v-model:value="item.key" :render-label="() => ''" />
                                    </n-form-item>
                                </div>
                                <div class="w-[50%] mr-[5px]">
                                    <n-form-item label="值" :show-label="true" label-placement="left" :label-style="{
                                        alignItems: 'center'
                                    }" :show-feedback="false" :path="`data.custom.header[${index}].value`">
                                        <n-input v-model:value="item.value" :render-label="() => ''" />
                                    </n-form-item>
                                </div>
                            </div>
                            <div class="ml-[10px] h-[34px] flex items-center">
                                <common-icon-button :type="IconButtonType['form-label-action']" :shortcut="{
                                    'icon.name': 'common-delete',
                                    'button.onClick': () => { customHeaderHandler.del(index) },
                                    'tooltipWrapper.content': '移除',
                                    'tooltipWrapper.enabled': true
                                }" />
                            </div>
                        </div>
                    </common-empty-form-item>
                </define-tool-area>
                <define-tool-area label="载荷(Payload)">
                    <n-form-item label="签发人(iss)" path="data.payload.iss" first>
                        <n-input clearable v-model:value="model.data.payload.iss" />
                    </n-form-item>
                    <n-form-item label="过期时间(exp)" path="data.payload.exp" first>
                        <n-date-picker v-model:value="model.data.payload.exp" type="datetime" clearable />
                    </n-form-item>
                    <n-form-item label="主题(sub)" path="data.payload.sub" first>
                        <n-input clearable v-model:value="model.data.payload.sub" />
                    </n-form-item>
                    <common-empty-form-item label="受众(aud)"
                        :show-feedback="(!model.append.payloadAud.isSingle) && (model.append.payloadAud.list || []).length > 0"
                        :actions="[
                            {
                                type: IconButtonType['form-label-action'],
                                shortcut: {
                                    'icon.name': 'common-list',
                                    'button.onClick': () => {
                                        model.append.payloadAud.isSingle = !model.append.payloadAud.isSingle
                                    },
                                    'tooltipWrapper.content': `${model.append.payloadAud.isSingle ? '切换列表' : '切换单个'}`,
                                    'tooltipWrapper.enabled': true
                                },
                                custom: {
                                    icon: {
                                        // @ts-ignore
                                        class: `${model.append.payloadAud.isSingle ? '' : 'text-primary'}`
                                    }
                                }
                            },
                            (!model.append.payloadAud.isSingle) ? {
                                type: IconButtonType['form-label-action'],
                                shortcut: {
                                    'icon.name': 'common-add',
                                    'button.onClick': () => {
                                        payloadAudListHandler.addNew()
                                    },
                                    'tooltipWrapper.content': '添加',
                                    'tooltipWrapper.enabled': true
                                },
                            } : undefined,
                        ]">
                        <template v-if="model.append.payloadAud.isSingle">
                            <n-form-item :show-label="false" :path="`append.payloadAud.item`" first>
                                <n-input clearable v-model:value="model.append.payloadAud.item" />
                            </n-form-item>
                        </template>
                        <template v-else>
                            <div v-for="(item, index) in model.append.payloadAud.list || []"
                                class="flex w-full ml-[10px] mb-[10px] last:mb-[0px]">
                                <div class="flex w-[calc(100%-40px)]">
                                    <div class="w-[100%] mr-[10px]">
                                        <n-form-item :show-label="false" :show-feedback="false"
                                            :path="`append.payloadAud[${index}].content`">
                                            <n-input v-model:value="item.content" :render-label="() => ''" />
                                        </n-form-item>
                                    </div>
                                </div>
                                <div class="ml-[10px] h-[34px] flex items-center">
                                    <common-icon-button :type="IconButtonType['form-label-action']" :shortcut="{
                                        'icon.name': 'common-delete',
                                        'button.onClick': () => { payloadAudListHandler.del(index) },
                                        'tooltipWrapper.content': '移除',
                                        'tooltipWrapper.enabled': true
                                    }" />
                                </div>
                            </div>
                        </template>
                    </common-empty-form-item>
                    <n-form-item label="生效时间(nbf)" path="data.payload.nbf" first>
                        <n-date-picker v-model:value="model.data.payload.nbf" type="datetime" clearable />
                    </n-form-item>
                    <n-form-item label="签发时间(iat)" path="data.payload.iat" first>
                        <n-date-picker v-model:value="model.data.payload.iat" type="datetime" clearable />
                    </n-form-item>
                    <n-form-item label="编号(jti)" path="data.payload.jti" first>
                        <n-input clearable v-model:value="model.data.payload.jti" />
                    </n-form-item>
                    <common-empty-form-item label="自定义数据" :show-feedback="(model.data.custom?.payload || []).length > 0"
                        :actions="[
                            {
                                type: IconButtonType['form-label-action'],
                                shortcut: {
                                    'icon.name': 'common-add',
                                    'button.onClick': () => {
                                        customPayloadHandler.addNew()
                                    },
                                    'tooltipWrapper.content': '添加',
                                    'tooltipWrapper.enabled': true
                                }
                            },
                        ]">
                        <div v-for="(item, index) in model.data.custom?.payload || []"
                            class="flex w-full ml-[10px] mb-[10px] last:mb-[0px]">
                            <div class="flex w-[calc(100%-40px)]">
                                <div class="w-[50%] mr-[10px]">
                                    <n-form-item label="名称" :show-label="true" label-placement="left" :label-style="{
                                        alignItems: 'center'
                                    }" :show-feedback="false" :path="`data.custom.payload[${index}].key`">
                                        <n-input v-model:value="item.key" :render-label="() => ''" />
                                    </n-form-item>
                                </div>
                                <div class="w-[50%] mr-[5px]">
                                    <n-form-item label="值" :show-label="true" label-placement="left" :label-style="{
                                        alignItems: 'center'
                                    }" :show-feedback="false" :path="`data.custom.payload[${index}].value`">
                                        <n-input v-model:value="item.value" :render-label="() => ''" />
                                    </n-form-item>
                                </div>
                            </div>
                            <div class="ml-[10px] h-[34px] flex items-center">
                                <common-icon-button :type="IconButtonType['form-label-action']" :shortcut="{
                                    'icon.name': 'common-delete',
                                    'button.onClick': () => { customPayloadHandler.del(index) },
                                    'tooltipWrapper.content': '移除',
                                    'tooltipWrapper.enabled': true
                                }" />
                            </div>
                        </div>
                    </common-empty-form-item>
                </define-tool-area>
                <define-tool-area label="秘钥">
                    <template v-if="NeedRsaKeyJwtAlgorithmList.includes(model.data.header.alg)">
                        <n-form-item label="私钥" path="append.rsaKeyPairs.privateKey" first>
                            <n-input type="textarea" clearable v-model:value="model.append.rsaKeyPairs.privateKey" />
                        </n-form-item>
                        <n-form-item label="公钥" path="append.rsaKeyPairs.publicKey" first>
                            <n-input type="textarea" clearable v-model:value="model.append.rsaKeyPairs.publicKey" />
                        </n-form-item>
                    </template>
                    <template v-else>
                        <n-form-item label="秘钥" path="data.secret" first>
                            <n-input clearable v-model:value="model.data.secret" />
                        </n-form-item>
                    </template>
                </define-tool-area>
            </n-form>
        </template>
        <template #output>
            <div class=" break-all">
                {{ result }}
            </div>
        </template>
    </define-tool-wrapper>
</template>
<script setup lang="ts">
import type { FormInst, FormRules } from 'naive-ui';
import { IconButtonType } from "@/components/common/icon-button/utils"

export type Model = {
    data: Omit<JwtEncodeOptions, "payload"> & {
        payload: Omit<JwtEncodeOptions['payload'], "aud">
    },
    append: {
        payloadAud: {
            isSingle: boolean,
            item?: string,
            list?: {
                content: string
            }[]
        }
        rsaKeyPairs: {
            privateKey: string | undefined
            publicKey: string | undefined
        }
    },
}

const message = useMessage()

const model = reactive<Model>({
    data: {
        header: {
            alg: JwtAlgorithm.HS256,
            typ: "JWT",
        },
        secret: "password",
        payload: {
        },
        custom: {
            header: [],
            payload: []
        }
    },
    append: {
        payloadAud: {
            isSingle: true,
            list: []
        },
        rsaKeyPairs: {
            privateKey: "",
            publicKey: ""
        }
    }
})

const payloadAudListHandler = {
    addNew: () => {
        const oldVal = [...model.append.payloadAud.list || []]
        const newVal = [...oldVal];
        newVal.push({
            content: "user"
        });
        model.append.payloadAud.list = newVal
    },
    del: (index: number) => {
        const oldVal = [...model.append.payloadAud.list || []]
        const newVal = oldVal.filter((v, i) => {
            return i !== index
        })
        model.append.payloadAud.list = newVal
    },
}


const customHeaderHandler = {
    addNew: () => {
        const newList = model.data.custom?.header || [];
        newList.push({
            key: "custom",
            value: "123"
        })
        model.data.custom = {
            ...model.data.custom,
            header: newList
        }
    },
    del: (index: number) => {
        const newCustomHeader = (model.data.custom?.header || []).filter((v, i) => {
            return i !== index
        })
        model.data.custom = {
            ...model.data.custom,
            header: newCustomHeader
        }
    }
}

const customPayloadHandler = {
    addNew: () => {
        const newList = model.data.custom?.payload || [];
        newList.push({
            key: "custom",
            value: "123"
        })
        model.data.custom = {
            ...model.data.custom,
            payload: newList
        }
    },
    del: (index: number) => {
        const newList = (model.data.custom?.payload || []).filter((v, i) => {
            return i !== index
        })
        model.data.custom = {
            ...model.data.custom,
            payload: newList
        }
    }
}

const formRef = ref<FormInst | null>(null);
const algorithmOptions = defineSelectOptionList<Record<JwtAlgorithm, unknown>>({
    [JwtAlgorithm["HS256"]]: { label: "HS256" },
    [JwtAlgorithm["HS384"]]: { label: "HS384" },
    [JwtAlgorithm["HS512"]]: { label: "HS512" },
    [JwtAlgorithm["RS256"]]: { label: "RS256" },
    [JwtAlgorithm["RS384"]]: { label: "RS384" },
    [JwtAlgorithm["RS512"]]: { label: "RS512" },
    [JwtAlgorithm["ES256"]]: { label: "ES256" },
    [JwtAlgorithm["ES384"]]: { label: "ES384" },
    [JwtAlgorithm["ES512"]]: { label: "ES512" },
    [JwtAlgorithm["PS256"]]: { label: "PS256" },
    [JwtAlgorithm["PS384"]]: { label: "PS384" },
    [JwtAlgorithm["PS512"]]: { label: "PS512" }
})

watch(() => model.data.header.alg, async (alg) => {
    if (NeedRsaKeyJwtAlgorithmList.includes(alg)) {
        model.append.rsaKeyPairs.privateKey = ""
        model.append.rsaKeyPairs.publicKey = ""
        try {
            const rsaKeyPairs = await jwtGenerateKeyPair(alg)
            model.append.rsaKeyPairs.privateKey = rsaKeyPairs.privateKey
            model.append.rsaKeyPairs.publicKey = rsaKeyPairs.publicKey
        } catch (error) {

        }
        message.info(`切换算法为${alg},已自动生成新的秘钥`)
    }
})

const result = computedAsync(async () => {
    let res = ""
    try {
        let secret = model.data.secret;
        let aud: string | undefined | string[] = model.append.payloadAud.item;
        if (!model.append.payloadAud.isSingle) {
            aud = model.append.payloadAud.list?.map(e => e.content)
        }

        if (NeedRsaKeyJwtAlgorithmList.includes(model.data.header.alg)) {
            secret = model.append.rsaKeyPairs.privateKey || ""
        }
        if (secret) {
            res = await jwtEncode({
                header: model.data.header,
                secret: secret,
                payload: {
                    ...model.data.payload,
                    aud
                },
                custom: {
                    header: model.data.custom?.header || [],
                    payload: model.data.custom?.payload || []
                }
            })
        }
    } catch (error) {
        res = ""
        console.log(error)
    }
    return res
})

const rules: FormRules = {

}
</script>