<template>
    <div class="size-full">
        <div class="h-full flex flex-col">
            <div class="h-[50px] flex justify-between items-center border-b">
                <div class="flex h-full items-center">
                    <a :href="home.href" target="_blank"
                        :class="`w-[50px] h-full items-center justify-center flex border-r hover:text-primary`">
                        <div
                            class="h-[36px] w-[36px] flex justify-center items-center cursor-pointer border rounded-[6px]">
                            <svg-icon :size="16" name="logo" />
                        </div>
                    </a>
                    <div class="ml-[10px] flex gap-1">
                        <tool-search />
                        <n-button type="primary" @click="goToOldTools">回旧版</n-button>
                    </div>
                </div>
                <div class="pr-[10px] flex">
                    <theme-button />
                    <a href="https://github.com/LiuWenXing1996/duoduo-tools" target="_blank"
                        :class="`h-full items-center justify-center flex pl-[2px]`">
                        <div
                            class="h-[36px] w-[36px] flex justify-center items-center cursor-pointer  rounded-[6px] hover:bg-hoverColor">
                            <svg-icon :size="16" name="github" />
                        </div>
                    </a>
                </div>
            </div>
            <div class="h-[calc(100%-50px)] flex">
                <workspace-side />
                <workspace-center />
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
const router = useRouter();
const home = router.resolve("/")
const editTabs = useEditTabs();

const title = computed(() => {
    const mainTitle = "多多益善-新布局"
    const tool = findTool(editTabs.currentTabName.value || "")
    return `${tool?.meta?.title ? `${tool?.meta?.title} - ` : ''}${mainTitle}`
})
useHead({
    title: title
})
const goToOldTools = () => { router.push("/") }
</script>