<template>
    <tool-wrapper>
        <template #input>
            <n-form :model="model" require-mark-placement="left">
                <tool-area label="密码">
                    <n-form-item path="text" label="输入" first>
                        <n-input clearable placeholder="输入密码" v-model:value="model.text" />
                    </n-form-item>
                </tool-area>
            </n-form>
        </template>
        <template #output>
            <n-descriptions label-placement="left" :column="1">
                <n-descriptions-item>
                    <template #label>
                        <div class="inline-flex">
                            <span class="font-medium">
                                得分
                            </span>
                        </div>
                    </template>
                    <div class="inline-flex">
                        <span>
                            {{ (textRes.score * 100).toFixed(0) }} / 100
                        </span>
                    </div>
                </n-descriptions-item>
                <n-descriptions-item>
                    <template #label>
                        <div class="inline-flex">
                            <span class="font-medium">
                                长度
                            </span>
                        </div>
                    </template>
                    <div class="inline-flex">
                        <span>
                            {{ textRes.passwordLength }}
                        </span>
                    </div>
                </n-descriptions-item>
                <n-descriptions-item>
                    <template #label>
                        <div class="inline-flex">
                            <span class="font-medium">
                                复杂度
                            </span>
                        </div>
                    </template>
                    <div class="inline-flex">
                        <span>
                            {{ (textRes.entropy).toFixed(2) }}
                        </span>
                    </div>
                </n-descriptions-item>
                <n-descriptions-item>
                    <template #label>
                        <div class="inline-flex">
                            <span class="font-medium">
                                暴力破解耗时
                            </span>
                        </div>
                    </template>
                    <div class="inline-flex">
                        <span>
                            {{ getHumanFriendlyDuration(textRes.secondsToCrack) }}
                        </span>
                    </div>
                </n-descriptions-item>
            </n-descriptions>
        </template>
    </tool-wrapper>
</template>
<script setup lang="ts">
export type Model = {
    text: string,
}
const initialText = `123456`

const model = reactive<Model>({
    text: initialText,
})

const getCharsetLength = (password: string) => {
    const hasLowercase = /[a-z]/.test(password);
    const hasUppercase = /[A-Z]/.test(password);
    const hasDigits = /\d/.test(password);
    const hasSpecialChars = /\W|_/.test(password);

    let charsetLength = 0;

    if (hasLowercase) {
        charsetLength += 26;
    }
    if (hasUppercase) {
        charsetLength += 26;
    }
    if (hasDigits) {
        charsetLength += 10;
    }
    if (hasSpecialChars) {
        charsetLength += 32;
    }

    return charsetLength;
}

const getPasswordCrackTimeEstimation = (password: string) => {
    const guessesPerSecond = 1e9;
    const charsetLength = getCharsetLength(password);
    const passwordLength = password.length;

    const entropy = password === '' ? 0 : Math.log2(charsetLength) * passwordLength;

    const secondsToCrack = 2 ** entropy / guessesPerSecond;
    const score = Math.min(entropy / 128, 1);

    return {
        entropy,
        charsetLength,
        passwordLength,
        secondsToCrack,
        score,
    };
}

const getHumanFriendlyDuration = (seconds: number) => {
    if (seconds < 1) {
        return "不到 1 秒"
    }
    const units: {
        key: string,
        label: string,
        secondsInUnit: number,
    }[] = [
            { key: "century", secondsInUnit: 60 * 60 * 24 * 365 * 100, label: "个世纪" },
            { key: "year", secondsInUnit: 60 * 60 * 24 * 365, label: "年" },
            { key: "minute", secondsInUnit: 60 * 60 * 24 * 30, label: "个月" },
            { key: "week", secondsInUnit: 60 * 60 * 24 * 7, label: "周" },
            { key: "day", secondsInUnit: 60 * 60 * 24, label: "天" },
            { key: "hour", secondsInUnit: 60 * 60, label: "小时" },
            { key: "minute", secondsInUnit: 60, label: "分钟" },
            { key: "second", secondsInUnit: 1, label: "秒" },
        ]
    let last = seconds;
    const unitsCount: {
        key: string,
        label: string,
        count: number
    }[] = []
    for (let index = 0; index < units.length; index++) {
        const unit = units[index];
        if (last >= unit.secondsInUnit) {
            const count = Math.floor(last / unit.secondsInUnit);
            last = last % unit.secondsInUnit;
            unitsCount.push({ ...unit, count })
        }
    }
    const res = unitsCount.map(u => {
        return `${u.count}${u.label}`
    }).filter(e => e).join("")

    return res
}

const textRes = computed(() => {
    const password = model.text || "";
    const result = getPasswordCrackTimeEstimation(password)
    return result
})
</script>