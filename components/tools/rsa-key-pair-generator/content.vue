<template>
    <define-tool-wrapper :output="{
        area: {
            disabled: true
        },
        scroll: {
            disabled: true
        }
    }">
        <template #input>
            <n-form ref="formRef" :model="model" :rules="rules" require-mark-placement="left">
                <define-tool-area label="配置">
                    <n-form-item path="bits" first label="长度">
                        <n-input-number v-model:value="model.bits" :min="256" :step="8" :max="16384" />
                    </n-form-item>
                </define-tool-area>
            </n-form>
        </template>
        <template #output>
            <div class="relative size-full">
                <div class="absolute top-0 bottom-0 left-0 right-0 pb-[10px]">
                    <div class="size-full">
                        <define-tool-area label="公钥" class="h-[50%]" fold-disabled>
                            <template #actions>
                                <svg-icon name="common-copy" class="cursor-pointer"
                                    @click="handleCopy(genRequest.data.value?.publicKeyPem || '')"></svg-icon>
                            </template>
                            <custom-scrollbar>
                                <div class=" whitespace-pre-wrap">
                                    {{ genRequest.data.value?.publicKeyPem }}
                                </div>
                            </custom-scrollbar>
                        </define-tool-area>
                        <define-tool-area label="私钥" class="h-[50%]" fold-disabled>
                            <template #actions>
                                <svg-icon name="common-copy" class="cursor-pointer"
                                    @click="handleCopy(genRequest.data.value?.privateKeyPem || '')"></svg-icon>
                            </template>
                            <custom-scrollbar>
                                <div class="whitespace-pre-wrap">
                                    {{ genRequest.data.value?.privateKeyPem }}
                                </div>
                            </custom-scrollbar>
                        </define-tool-area>
                    </div>
                </div>
            </div>
        </template>
        <template #actions>
            <n-space>
                <n-button size="small" :loading="genRequest.loading.value" @click="genRequest.runAsync">生成</n-button>
            </n-space>
        </template>
    </define-tool-wrapper>
</template>
<script setup lang="ts">
import copy from 'copy-to-clipboard';
import type { FormRules } from 'naive-ui';
import { pki } from 'node-forge';
// @ts-ignore
import workerScript from 'node-forge/dist/prime.worker.min?url';

export type Model = {
    bits: number,
}

const generateRawPairs = (bits: number) => {
    return new Promise<pki.rsa.KeyPair>((resolve, reject) =>
        pki.rsa.generateKeyPair({ bits, workerScript }, (err, keyPair) => {
            if (err) {
                reject(err);
                return;
            }

            resolve(keyPair);
        }),
    );
}

const generateKeyPair = async (bits: number) => {
    const { privateKey, publicKey } = await generateRawPairs(bits);
    return {
        publicKeyPem: pki.publicKeyToPem(publicKey),
        privateKeyPem: pki.privateKeyToPem(privateKey),
    };
}

const model = reactive<Model>({
    bits: 2048,
})
const form = useTemplateRef("formRef")
const genRequest = useCustomRequest(async () => {
    const isValid = await form.value?.validate();
    if (!isValid) {
        return
    }
    const keys = await generateKeyPair(model.bits);
    return keys;
})

const rules: FormRules = {
    bits: [
        {
            validator: (_rule, value: number) => {
                if (value < 256) {
                    return false
                }
                if (value > 16384) {
                    return false
                }
                if (value % 8 !== 0) {
                    return false
                }
                return true
            },
            message: '长度需要在 256 和 16384 之间，且必须是 8 的倍数',
            trigger: ['input', 'change', 'blur', 'focus']
        }
    ]
}

onMounted(() => {
    genRequest.runAsync()
})

const message = useMessage()

const handleCopy = (val: string) => {
    const res = copy(val || "");
    if (res) {
        message.success("复制成功")
    } else {
        message.error("复制失败")
    }
}
</script>