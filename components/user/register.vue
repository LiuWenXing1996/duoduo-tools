<template>
  <div class="w-full">
    <n-form ref="formRef" :model="model" label-placement="left" label-width="80px" label-align="right" :rules="rules">
      <n-form-item label="用户名" path="name" first>
        <n-input v-model:value="model.name" placeholder="请输入用户名" />
      </n-form-item>
      <n-form-item label="邮箱" path="email" ref="formItemEmailRef" first>
        <n-input v-model:value="model.email" placeholder="请输入邮箱" />
      </n-form-item>
      <n-form-item label="验证码" path="code" first>
        <n-input v-model:value="model.code" placeholder="请输入验证码" />
        <n-button :loading="sendRegisterCodeRequest.loading.value" type="primary"
          @click="sendRegisterCodeRequest.runAsync">
          获取验证码
        </n-button>
      </n-form-item>
      <n-form-item label="密码" path="password" first>
        <n-input v-model:value="model.password" type="password" placeholder="请输入密码" show-password-on="click" />
      </n-form-item>
      <n-form-item label="确认密码" path="confirmPassword" first>
        <n-input v-model:value="model.confirmPassword" type="password" placeholder="再次输入密码" show-password-on="click" />
      </n-form-item>
      <n-form-item label=" " :show-feedback="false" first>
        <div class=" flex flex-col	">
          <div>
            <n-button type="primary" :loading="registerRequest.loading.value" @click="registerRequest.runAsync">
              注册
            </n-button>
          </div>
          <div>
            <n-button size="tiny" @click="emits('toggleLogin')" text>
              已有账号? 立即登录
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
  (e: 'toggleLogin'): void
}>()

const form = useTemplateRef("formRef")
const formItemEmail = useTemplateRef("formItemEmailRef")
const model = reactive({
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
  code: "",
})
const message = useMessage();
const routeHelper = useRouteHelper();
const sendRegisterCodeRequest = useCustomRequest(async () => {
  const validEmail = await formItemEmail.value?.validate()
  if (!validEmail) {
    return
  }
  const res = await $fetch("/api/email/send-code", {
    method: "POST",
    body: {
      email: model.email,
    },
  });
  if (res) {
    message.success("验证码已发送")
  }
})
const registerRequest = useCustomRequest(async () => {
  const isValid = await form.value?.validate();
  if (!isValid) {
    return
  }
  const params: UserRegisterPostApiParams = {
    name: model.name,
    email: model.email,
    password: model.password,
    code: model.code
  }
  const res = await $fetch("/api/user/register", {
    method: "post",
    body: params,
  });
  if (!res) {
    throw new Error("注册成功")
  }
  await routeHelper.reload()
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
  password: [
    { required: true, message: '请输入用户密码', trigger: ["change", 'blur'] },
    {
      validator: (rule, value) => {
        return validatePassword(value)
      }, message: '密码只能包含字母和数字，且长度不能小于8', trigger: ["change", 'blur']
    }
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
  ],
  email: [
    { required: true, message: '请输入用户邮箱', trigger: ["change", 'blur'] },
    { type: "email", message: '请输入格式正确的邮箱', trigger: ["change", 'blur'] }
  ],
  code: [
    { required: true, message: '请输入验证码', trigger: ["change", 'blur'] }
  ]
})

</script>
