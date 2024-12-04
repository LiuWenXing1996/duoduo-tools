<template>
    <div class="w-full h-full flex justify-center items-center p-[30px]">
        <div class="w-[500px]">
            <n-form ref="formRef" :model="model" :rules="rules">
                <n-divider title-placement="center">
                    设置超管
                </n-divider>
                <n-form-item path="name" label="用户名" first>
                    <n-input v-model:value="model.name" placeholder="请输入用户名"></n-input>
                </n-form-item>
                <n-form-item path="email" label="邮箱" first>
                    <n-input v-model:value="model.email" placeholder="请输入邮箱"></n-input>
                </n-form-item>
                <n-form-item path="password" label="密码" first>
                    <n-input v-model:value="model.password" type="password" show-password-on="click"
                        placeholder="请输入密码"></n-input>
                </n-form-item>
                <n-form-item path="confirmPassword" label="确认密码" first>
                    <n-input v-model:value="model.confirmPassword" type="password" show-password-on="click"
                        placeholder="再次输入密码"></n-input>
                </n-form-item>
            </n-form>
            <n-space justify="center">
                <n-button type="primary" :loading="systemInitRequest.loading.value"
                    @click="systemInitRequest.refresh()">
                    初始化</n-button>
            </n-space>
        </div>
    </div>
</template>
<script setup lang="ts">
import type { FormRules } from "naive-ui";
import type { Params } from "~/server/api/system/init.post"
import { validateUserName } from '~/utils';
const form = useTemplateRef("formRef")
const model = reactive({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
})
const rules = reactive<FormRules>({
    name: [
        { required: true, message: '请输入用户名', trigger: ["change", 'blur'] },
        {
            validator: (rule, value) => {
                return validateUserName(value)
            }, message: '用户名只能包含字母和数字和中文，且长度不能小于4', trigger: ["change", 'blur']
        }
    ],
    email: [
        { required: true, message: '请输入邮箱', trigger: ["change", 'blur'] },
        { type: "email", message: '请输入格式正确的邮箱', trigger: ["change", 'blur'] }
    ],
    password: [
        { required: true, message: '请输入密码', trigger: ["change", 'blur'] },
        {
            validator: (rule, value) => {
                return validatePassword(value)
            }, message: '密码只能包含字母和数字，且长度不能小于8', trigger: ["change", 'blur']
        },
    ],
    confirmPassword: [
        { required: true, message: '请再次输入密码', trigger: ["change", 'blur'] },
        {
            validator: (rule, value) => {
                return validatePassword(value)
            }, message: '密码只能包含字母和数字，且长度不能小于8', trigger: ["change", 'blur']
        },
        {
            validator: (rule, value) => {
                return value === model.password
            }, message: '两次密码不一致', trigger: ["change", 'blur']
        }
    ]
})
const systemInitRequest = useCustomRequest(async () => {
    if (!form.value) {
        return
    }
    const valid = await form.value.validate();
    if (!valid) {
        return
    }
    const params: Params = {
        name: model.name,
        email: model.email,
        password: model.password,
    }
    const res = await $fetch("/api/system/init", {
        method: "POST",
        body: params,
    })
    if (!res) {
        throw new Error("初始化失败")
    }
    return navigateTo("/", {
        replace: true
    })
})

definePageMeta({
    middleware: [defineNuxtRouteMiddleware(async (to, from) => {
        const systemInited = await $fetch("/api/system/is-inited")
        if (systemInited) {
            return navigateTo("/", {
                replace: true
            })
        }
    })]
})
</script>
