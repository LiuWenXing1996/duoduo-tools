<template>
  <div class="w-full">
    <n-form ref="formRef" label-placement="left" label-width="70px" label-align="right" :model="model" :rules="rules">
      <n-form-item label="登录方式" path="mode" first>
        <n-radio-group v-model:value="model.mode">
          <n-radio-button key="name" value="name">
            <div class="flex h-[32px] justify-center">
              <span class="flex items-center">
                <n-icon>
                  <user-login-mode-name-icon />
                </n-icon>
              </span>
            </div>
          </n-radio-button>
          <n-radio-button key="email" value="email">
            <div class="flex h-[32px] justify-center">
              <span class="flex items-center">
                <n-icon>
                  <user-login-mode-email-icon />
                </n-icon>
              </span>
            </div>
          </n-radio-button>
        </n-radio-group>
      </n-form-item>
      <n-form-item label="用户名" path="name" v-if="model.mode === 'name'" first>
        <n-input v-model:value="model.name" placeholder="请输入用户名" />
      </n-form-item>
      <n-form-item label="邮箱" path="email" v-if="model.mode === 'email'" first>
        <n-input v-model:value="model.email" placeholder="请输入邮箱" />
      </n-form-item>
      <n-form-item label="密码" path="password" first>
        <n-input v-model:value="model.password" type="password" placeholder="请输入密码" show-password-on="click" />
      </n-form-item>
      <n-form-item label=" " :show-feedback="false" first>
        <div class=" flex flex-col	">
          <div>
            <n-button type="primary" :loading="loginRequest.loading.value" @click="loginRequest.refreshAsync()">
              登录
            </n-button>
          </div>
          <div>
            <n-button size="tiny" @click="emits('toggleRegister')" text>
              没有账号? 立即注册
            </n-button>
          </div>
        </div>
      </n-form-item>
    </n-form>
  </div>
</template>
<script setup lang="ts">
import type { FormRules } from 'naive-ui';

const emits = defineEmits<{
  (e: 'toggleRegister'): void
}>()
const routeHelper = useRouteHelper();
const form = useTemplateRef("formRef")
const model = reactive({
  mode: "name",
  name: "",
  password: "",
  email: "",
})

const loginRequest = useCustomRequest(async () => {
  const isValid = await form.value?.validate();
  if (!isValid) {
    return
  }
  const mode = model.mode;
  let res = false
  if (mode === "name") {
    res = await $fetch("/api/user/login-with-name", {
      method: "POST",
      body: {
        name: model.name,
        password: model.password,
      },
    });
  }
  if (mode === "email") {
    res = await $fetch("/api/user/login-with-email", {
      method: "POST",
      body: {
        email: model.email,
        password: model.password,
      },
    });
  }
  if (!res) {
    throw new Error("登录失败")
  }
  await routeHelper.reload()
})

const rules = reactive<FormRules>({
  name: [
    { required: true, message: '请输入用户名', trigger: ["change", 'blur'] },
  ],
  password: [
    { required: true, message: '请输入密码', trigger: ["change", 'blur'] },
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: ["change", 'blur'] },
    { type: "email", message: '请输入格式正确的邮箱', trigger: ["change", 'blur'] }
  ],
})
</script>
