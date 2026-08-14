import { ChainNode } from "./chain-node";
import { ChainRecord } from "./chain-record";
import type LogicFlow from "@logicflow/core";
import type { Tool } from "./tool";
import type { FlowGraphData } from "./flow";

export class Chain {
  private _nodes: ChainNode[] = [];
  private _records: ChainRecord[] = [];
  hasNode(id: string) {
    return this._nodes.some((item) => item.id === id);
  }
  getNode(id: string) {
    return this._nodes.find((item) => item.id === id);
  }
  addNode(node: ChainNode) {
    if (this.hasNode(node.id)) {
      throw new Error("节点已存在");
    }
    this._nodes.push(node);
  }
  run() {
    const record = new ChainRecord(this._nodes);
    this._records.push(record);
    record.run();
  }
  getRecords() {
    return this._records;
  }
}

export const createChainFromFLow = (
  flowGraphData: FlowGraphData,
  tools: Tool[],
) => {
  const { nodes, edges } = flowGraphData;
  const chainNodes = nodes.map((item) => {
    const chainNode = new ChainNode(item.id);
    const data = item.properties.data;
    const tool = tools.find((tool) => tool.name === data.toolName);
    if (!tool) {
      throw new Error(`工具${data.toolName}不存在`);
    }
    chainNode.setTool(tool);
    return chainNode;
  });
  edges.map((item) => {
    const sourceNodeId = item.sourceNodeId;
    const sourceKey = item.properties.data.sourceKey;
    const targetNodeId = item.targetNodeId;
    const targetKey = item.properties.data.targetKey;
    const targetChainNode = chainNodes.find(
      (node) => node.flowNodeID === targetNodeId,
    );
    if (!targetChainNode) {
      throw new Error(`目标节点${targetNodeId}不存在`);
    }
    targetChainNode.addInput(targetKey, sourceNodeId, sourceKey);
  });
  const chain = new Chain();
  chainNodes.forEach((item) => chain.addNode(item));
  return chain;
};
