<template>
    <tool-content :vertical="{
        enabled: true,
        top: {
            class: '!h-[15%]'
        },
        bottom: {
            class: '!h-[85%]'
        }
    }" :output="{
        scroll: {
            disabled: true
        },
        area: {
            label: '抛硬币'
        }
    }">
        <template #output>
            <div class="flex flex-col size-full">
                <div class="h-[150px] flex items-center justify-center">
                    <div class="rotate-wrap"
                        :class="[genStatus == true ? (isHeads == true ? 'rotate-wrap-ani-z' : 'rotate-wrap-ani-f') : '']">
                        <div class="front circle" :class="[isHeads == true ? 'is-head' : '']"></div>
                        <div class="reverse circle" :class="[isHeads == false ? 'is-head' : '']"></div>
                    </div>
                </div>
                <div class="h-[calc(100%-150px)]">
                    <n-card class="size-full" size="small">
                        <template #header>
                            <span>历史记录</span>
                            <span class="text-[12px] ml-[2px] mr-[2px]">正面: {{ history.filter(e => e).length }}</span>
                            <span class="text-[12px]">反面: {{ history.filter(e => !e).length }}</span>
                        </template>
                        <template #header-extra>
                            <n-space>
                                <icon-button name="common-clear" @click="() => { history = [] }" tooltip="清空历史" />
                                <icon-button name="common-copy" @click="() => { copyHistory() }" tooltip="复制历史" />
                            </n-space>
                        </template>
                        <custom-scrollbar>
                            <n-space>
                                <n-tag :bordered="false" :type="item ? 'success' : 'default'" v-for="item in history">
                                    <div class="font-mono">
                                        {{ formatDisplay(item) }}
                                    </div>
                                </n-tag>
                            </n-space>
                        </custom-scrollbar>
                    </n-card>
                </div>
            </div>
        </template>
        <template #actions>
            <n-space>
                <n-button size="small" :disabled="genStatus" @click="resRequest.run">掷硬币</n-button>
            </n-space>
        </template>
    </tool-content>
</template>

<script setup lang="tsx">
export type Model = {
    content: string,
}
export type Result = {
    content: boolean,
}
const genStatus = ref(false)
const isHeads = ref(true)

const throwCoin = async (): Promise<boolean> => {
    if (genStatus.value) {
        return isHeads.value
    }
    genStatus.value = true
    return new Promise((resolve, reject) => {
        isHeads.value = Math.random() < 0.5;
        setTimeout(() => {
            genStatus.value = false;
            resolve(isHeads.value)
        }, 2500); // 休眠5秒，5000毫秒
    })
}
const copy = useCopy();
const history = ref<boolean[]>([]);

const copyHistory = () => {
    const rawList = history.value || [];
    const formattedList = rawList.map(e => formatDisplay(e));
    copy(formattedList.join(','));
}

const formatDisplay = (val: boolean) => {
    return val == true ? '正面' : '反面'
}

const resRequest = useCustomRequest<Result | undefined>(async () => {
    let res: Result | undefined = undefined;
    try {
        const content = await throwCoin();
        res = {
            content: content
        }
        history.value.push(content)
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

<style scoped>
.rotate-wrap {
    /* width: 100%; */
    width: 100px;
    height: 100px;
    margin: 50px;
    transform-style: preserve-3d;
    position: relative;
}

.rotate-wrap-ani-z {
    /* animation: rotate 5s; */
    animation: rotateZ 2.5s linear infinite;
}

.rotate-wrap-ani-f {
    /* animation: rotate 5s; */
    animation: rotateF 2.5s linear infinite;
}

.rotate-wrap:hover {
    animation-play-state: paused;
}

.rotate-wrap .front,
.rotate-wrap .reverse {
    width: 100px;
    height: 100px;
    background-size: cover;
}

.rotate-wrap .front {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    background-image: url(~/assets/images/coin/dollar.png);
}

.rotate-wrap .reverse {
    background-image: url(~/assets/images/coin/xingxing.png);
}

.circle {
    border-radius: 50%;
}

.line {
    height: 200px;
    width: 1px;
    position: absolute;
    top: 0;
    left: 50%;
    background: red;
    transform: translateZ(0px);
}

.is-head {
    transform: translateZ(1px);
}

@keyframes rotateZ {
    0% {
        transform: rotateX(0deg);
    }

    20% {
        transform: rotateX(720deg) scale(1.2);
    }

    50% {
        transform: rotateX(1080deg) scale(1.5);
    }

    80% {
        transform: rotateX(1440deg) scale(1.2);
    }

    100% {
        transform: rotateX(2160deg);
    }
}

@keyframes rotateF {
    0% {
        transform: rotateX(0deg);
    }

    20% {
        transform: rotateX(720deg) scale(1.2);
    }

    50% {
        transform: rotateX(1080deg) scale(1.5);
    }

    80% {
        transform: rotateX(1440deg) scale(1.2);
    }

    100% {
        transform: rotateX(1980deg);
    }
}
</style>