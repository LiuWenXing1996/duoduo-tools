<template>
    <define-tool-wrapper :vertical="{
        enabled: true,
        top: {
            class: '!h-[20%]'
        },
        bottom: {
            class: '!h-[80%]'
        }
    }" :output="{
        scroll: {
            disabled: true
        },
        area: {
            label: '计时器'
        }
    }">
        <template #output>
            <div class="flex flex-col size-full">
                <div class="h-[30%] flex items-center justify-center">
                    <div class="text-[5vh] font-mono">
                        {{ formatMs(counter) }}
                    </div>
                </div>
                <div class="h-[70%]">
                    <n-card title="历史记录" class="size-full" size="small">
                        <template #header-extra>
                            <n-space>
                                <common-icon-button type="common" :shortcut="{
                                    'icon.name': 'common-clear',
                                    'button.onClick': () => { history = [] },
                                    'tooltipWrapper.content': '清空历史',
                                    'tooltipWrapper.enabled': true,
                                }" />
                                <common-icon-button type="common" :shortcut="{
                                    'icon.name': 'common-copy',
                                    'button.onClick': () => { copyHistory() },
                                    'tooltipWrapper.content': '复制历史',
                                    'tooltipWrapper.enabled': true,
                                }" />
                            </n-space>
                        </template>
                        <custom-scrollbar>
                            <n-space>
                                <n-tag :bordered="false" v-for="item in history">
                                    <div class="font-mono">
                                        {{ formatMs(item) }}
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
                <n-button size="small" :type="isRunning ? 'default' : 'primary'"
                    @click="isRunning ? pause() : resume()">
                    {{ isRunning ? '暂停' : '开始' }}
                </n-button>
                <n-button size="small" @click="counter = 0">重置</n-button>
            </n-space>
        </template>
    </define-tool-wrapper>
</template>

<script setup lang="tsx">

export type Model = {
    content: string,
}

const isRunning = ref(false);
const counter = ref(0);
const copy = useCopy();

let previousRafDate = Date.now();
const { pause: pauseRaf, resume: resumeRaf } = useRafFn(
    () => {
        const deltaMs = Date.now() - previousRafDate;
        previousRafDate = Date.now();
        counter.value += deltaMs;
    },
    { immediate: false },
);

const resume = () => {
    previousRafDate = Date.now();
    resumeRaf();
    isRunning.value = true;
}

const pause = () => {
    pauseRaf();
    history.value.push(counter.value);
    isRunning.value = false;
}

const formatMs = (msTotal: number) => {
    const ms = msTotal % 1000;
    const secs = ((msTotal - ms) / 1000) % 60;
    const mins = (((msTotal - ms) / 1000 - secs) / 60) % 60;
    const hrs = (((msTotal - ms) / 1000 - secs) / 60 - mins) / 60;
    const hrsString = hrs > 0 ? `${hrs.toString().padStart(2, '0')}:` : '';

    return `${hrsString}${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}.${ms
        .toString()
        .padStart(3, '0')}`;
}

const history = ref<number[]>([]);

const copyHistory = () => {
    const rawList = history.value || [];
    const formattedList = rawList.map(formatMs);
    copy(formattedList.join('\n'));
}

</script>