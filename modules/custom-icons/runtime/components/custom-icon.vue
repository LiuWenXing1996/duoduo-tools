<template>
  <span class="custom-icon" :class="{ 'custom-icon--fill': !filled, 'custom-icon--stroke': hasStroke && !filled }"
    v-html="icon"></span>
</template>

<script setup lang="ts">
import { ref, watchEffect } from '#imports'
import { kebabCase } from "change-case";

const props = withDefaults(defineProps<{
  name: string;
  filled?: boolean
}>(), { filled: false })

const toNormalIconName = (findIconPath: string) => {
  const start = `/assets/icons/`
  const end = `.svg`
  const findPathName = findIconPath.slice(start.length, -end.length);
  const normalIconName = kebabCase(findPathName);
  return normalIconName
}

const icon = ref<string | Record<string, any>>('')
let hasStroke = false

async function getIcon() {
  try {
    // @ts-ignore
    const iconsImport = import.meta.glob(`assets/icons/**/**.svg`, {
      eager: false,
      query: '?raw',
      import: 'default'
    })
    const allFindIconPathList = Object.keys(iconsImport);
    const allNormalIcons: Record<string, any> = {};
    allFindIconPathList.map(findIconPath => {
      const normalIconName = toNormalIconName(findIconPath);
      allNormalIcons[normalIconName] = iconsImport[findIconPath]
    })
    const rawIcon = await allNormalIcons[props.name]()
    if (rawIcon.includes('stroke')) { hasStroke = true }
    icon.value = rawIcon
  } catch {
    console.error(
      `[custom-icons] Icon '${props.name}' doesn't exist in 'assets/icons'`
    )
  }
}

await getIcon()

watchEffect(getIcon)
</script>

<style>
.custom-icon svg {
  width: 1em;
  height: 1em;
  margin-bottom: 0.125em;
  vertical-align: middle;
}

.custom-icon.custom-icon--fill,
.custom-icon.custom-icon--fill * {
  fill: currentColor !important;
}

.custom-icon.custom-icon--stroke,
.custom-icon.custom-icon--stroke * {
  stroke: currentColor !important;
}
</style>
