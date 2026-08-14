<template>
    <tool-content :output="{
        scroll: {
            disabled: true
        },
        area: {
            label: '编辑'
        }
    }">
        <template #input>
            <tool-area>
                <n-button size="small" type="primary" @click="getGraphData">
                    获取图数据
                </n-button>
                <n-button size="small" type="primary" @click="run">
                    运行
                </n-button>
                <n-button size="small" type="primary" @click="getRecords">
                    获取记录
                </n-button>
            </tool-area>
            <tool-area>
                <n-log :rows="5" :log="log" />
            </tool-area>
        </template>
        <template #output>
            <div class="relative size-full ">
                <div class="absolute top-0 bottom-0 left-0 right-0">
                    <div ref="editorContainer" class="size-full tool-flow-container"></div>
                </div>
            </div>
        </template>
    </tool-content>
</template>

<script setup lang="tsx">

import { createToolFlow } from './flow';
import { areaTransferTool } from "~/components/tools/area-transfer/meta";
import { z } from "zod";
import { zodJsonSchemaToLogicFlowNodeProperties } from "~/core/tool";
import type LogicFlow from '@logicflow/core';
import { Chain, createChainFromFLow } from '~/core/chain';
import { createFlowGraphNode, type FlowGraphData } from '~/core/flow';
import { create } from 'lodash';
import { allDuoTools } from './all-tools';

const editorContainerRef = useTemplateRef("editorContainer");

let lf: LogicFlow | null = null;

watch([
    () => editorContainerRef.value
], async ([editorContainer]) => {
    if (editorContainer) {

        lf = createToolFlow({ container: editorContainer });
        lf.render({})
    }
})
const getGraphData = () => {
    if (!lf) {
        return
    }

    const graphData = lf.getGraphRawData();
    console.log(graphData);

}
const chains: Chain[] = []
const run = () => {
    if (!lf) {
        return
    }
    const graphData = lf.getGraphRawData() as FlowGraphData;
    const chain = createChainFromFLow(graphData, allDuoTools);
    chains.push(chain);
    chain.run();
    const records = chain.getRecords();
    records.map(record => {
        const list = record.records
        list.map((item) => {
            const { time, node, description, returns } = item;
            const r = `${time} ${description}`
            logList.value.push(r);
        })

    })
}
const log = computed(() => {
    return logList.value.join('\n');
})
const logList = ref<string[]>([]);
const getRecords = () => {
    const records = chains.map((item) => item.getRecords());
    console.log(records);
}
</script>
<style lang="less">
.tool-flow-container {
    .table-container {
        box-sizing: border-box;
        padding: 10px;
    }

    .table-fields-container {
        display: flex;

        .table-fields {
            width: 50%;
        }
    }

    .table-node {
        width: 100%;
        height: 100%;
        overflow: hidden;
        background: #fff;
        border-radius: 4px;
        box-shadow: 0 1px 3px rgb(0 0 0 / 30%);
    }

    .table-node::before {
        display: block;
        width: 100%;
        height: 8px;
        background: #d79b00;
        content: '';
    }

    .table-node.table-color-1::before {
        background: #9673a6;
    }

    .table-node.table-color-2::before {
        background: #dae8fc;
    }

    .table-node.table-color-3::before {
        background: #82b366;
    }

    .table-node.table-color-4::before {
        background: #f8cecc;
    }

    .table-name {
        height: 28px;
        font-size: 14px;
        line-height: 28px;
        text-align: center;
        background: #f5f5f5;
    }

    .table-feild {
        display: flex;
        justify-content: space-between;
        height: 24px;
        padding: 0 10px;
        font-size: 12px;
        line-height: 24px;
    }

    .feild-type {
        color: #9f9c9f;
    }

    /* 自定义锚点样式 */

    .custom-anchor {
        cursor: crosshair;
        fill: #d9d9d9;
        stroke: #999;
        stroke-width: 1;
        rx: 3;
        ry: 3;
    }

    .custom-anchor:hover {
        fill: #ff7f0e;
        stroke: #ff7f0e;
    }

    .lf-node-not-allow .custom-anchor:hover {
        cursor: not-allowed;
        fill: #d9d9d9;
        stroke: #999;
    }

    .incomming-anchor {
        stroke: #d79b00;
    }

    .outgoing-anchor {
        stroke: #82b366;
    }
}
</style>
