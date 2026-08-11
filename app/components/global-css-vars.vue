<template></template>
<script setup lang="ts">
import { useThemeVars } from 'naive-ui';
import { kebabCase } from "change-case";

const themeVars = useThemeVars();
const styleTag = useStyleTag("");
watch(
    () => themeVars.value,
    () => {
        const themeVarsValue = themeVars.value;
        const vars = Object.entries(themeVarsValue).map(([key, value]) => {
            const keyFormatted = `--naive-${kebabCase(key)}`;
            return {
                name: keyFormatted,
                value,
            };
        });
        styleTag.css.value = `
:root {
${vars
                .map((v) => {
                    return `${v.name}:${v.value}`;
                })
                .join(";\n")}
}
      `;
    },
    {
        immediate: true,
    }
);
</script>