<template>
    <tool-wrapper>
        <template #input>
            <n-form :model="model">
                <define-tool-area label="输入">
                    <n-form-item path="transferType" first label="转换类型">
                        <n-select :options="transferTypeOptions" v-model:value="model.transferType"></n-select>
                    </n-form-item>
                    <n-form-item path="type" first label="时间戳类型">
                        <n-select :options="typeOptions" v-model:value="model.type"></n-select>
                    </n-form-item>
                    <n-form-item path="timestamp" first label="时间戳" v-if="model.transferType === TransferType.date">
                        <n-input v-model:value="model.timestamp"></n-input>
                    </n-form-item>
                    <n-form-item path="date" first label="日期" v-if="model.transferType === TransferType.timestamp">
                        <n-input v-model:value="model.date"></n-input>
                    </n-form-item>
                </define-tool-area>
            </n-form>
        </template>
        <template #output>
            <div class=" break-all">
                {{ res }}
            </div>
        </template>
        <template #actions>
            <n-space>
                <n-button size="small" @click="copy(res)">复制</n-button>
            </n-space>
        </template>
    </tool-wrapper>
</template>

<script setup lang="ts">
import dayjs, { Dayjs } from "dayjs"

enum TransferType {
    timestamp = "timestamp",
    date = "date"
}

enum TimestampType {
    s = "s",
    ms = "ms"
}

export type Model = {
    transferType: TransferType,
    type: TimestampType,
    date: string,
    timestamp: string
}

const model = reactive<Model>({
    date: '',
    timestamp: "",
    type: TimestampType.ms,
    transferType: TransferType.date,
})

const copy = useCopy()

const transferTypeOptions = defineSelectOptionList<Record<TransferType, unknown>>({
    [TransferType.timestamp]: { label: "日期转时间戳" },
    [TransferType.date]: { label: "时间戳转日期" },
})

const typeOptions = defineSelectOptionList<Record<TimestampType, unknown>>({
    [TimestampType.s]: { label: "秒" },
    [TimestampType.ms]: { label: "毫秒" },
})

onMounted(() => {
    const now = dayjs();
    model.date = toDate(now);
    model.timestamp = toTimestamp(now, model.type)
})

const tpl = "YYYY-MM-DD HH:mm:ss"

const fromDate = (date: string) => {
    return dayjs(date, tpl)
}

const fromTimestamp = (timestamp: string, type: TimestampType) => {
    if (type === TimestampType.ms) {
        return dayjs(Number(timestamp))
    }
    if (type === TimestampType.s) {
        return dayjs.unix(Number(timestamp))
    }
}

const toDate = (dayjsInstance: Dayjs) => {
    return dayjsInstance.format(tpl)
}

const toTimestamp = (dayjsInstance: Dayjs, type: TimestampType): string => {
    if (type === TimestampType.s) {
        return dayjsInstance.unix().toString()
    }
    if (type === TimestampType.ms) {
        return dayjsInstance.valueOf().toString()
    }
    return ""
}

const res = computed(() => {
    const transferType = model.transferType;
    const timestamp = model.timestamp;
    const type = model.type;
    const date = model.date;
    let text = "";
    if (transferType === TransferType.timestamp) {
        if (date) {
            const dayjsInstance = fromDate(date);
            if (dayjsInstance) {
                text = toTimestamp(dayjsInstance, type)
            }
        }
    }
    if (transferType === TransferType.date) {
        if (timestamp) {
            const dayjsInstance = fromTimestamp(timestamp, type);
            if (dayjsInstance) {
                text = toDate(dayjsInstance)
            }
        }
    }
    return text
})

</script>