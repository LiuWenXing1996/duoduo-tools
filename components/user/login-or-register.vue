<template>
    <user-login v-if="isLogin" @toggle-register="isLogin = false" />
    <user-register v-else @toggle-login="isLogin = true" />
</template>
<script setup lang="ts">
const isLogin = ref(true)
</script>