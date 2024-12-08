<template>
  <span class="custom-icon" :class="{ 'custom-icon--fill': !filled, 'custom-icon--stroke': hasStroke && !filled }"
    v-html="icon"></span>
</template>

<script setup lang="ts">
import { ref, watchEffect } from '#imports'
import { split } from "change-case";

const props = withDefaults(defineProps<{
  name: string;
  filled?: boolean
}>(), { filled: false })


const icon = ref<string | Record<string, any>>('')
let hasStroke = false

async function getIcon() {
  try {
    // @ts-ignore
    const iconsImport = import.meta.glob('assets/icons/**/**.svg', {
      eager: false,
      query: '?raw',
      import: 'default'
    })
    const allPathPoints = split(props.name);
    let allPaths: string[] = [];
    const getPoints = (i: number, input: string[]): string[][] => {
      if (i === 1) {
        return ["/", "-"].map(e => {
          return [...input, e]
        })
      } else {
        const children = ["/", "-"].map(e => {
          return [...input, e]
        }).map(e => getPoints(i - 1, e)).flat()
        return children
      }
    }
    if (allPathPoints.length === 1) {
      allPaths = [allPathPoints[0]]
    } else {
      const allPoints = getPoints(allPathPoints.length - 1, []);
      allPaths = allPoints.map((points) => {
        const str: string = allPathPoints.map((pathPoint, pathPointIndex) => {
          const point = points[pathPointIndex] || ""
          return [pathPoint, point]
        }).flat().join('');
        return str
      })
    }
    const pathName = allPaths.find(pathVal => {
      return iconsImport[`/assets/icons/${pathVal}.svg`]
    });
    const rawIcon = await iconsImport[`/assets/icons/${pathName}.svg`]()
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
