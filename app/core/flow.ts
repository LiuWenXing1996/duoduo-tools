import type LogicFlow from "@logicflow/core";
import { zodJsonSchemaToLogicFlowNodeProperties, type Tool } from "./tool";
import { v4 as uuidV4 } from "uuid";
import z from "zod";

export interface FlowGraphNodePropertiesType extends LogicFlow.PropertiesType {
  data: {
    toolName: string;
  };
}

export interface FlowGraphNode extends LogicFlow.NodeData {
  properties: FlowGraphNodePropertiesType;
}

export interface FlowGraphEdgePropertiesType extends LogicFlow.PropertiesType {
  data: {
    inputToolName: string;
    sourceKey: string;
    outputToolName: string;
    targetKey: string;
  };
}
export interface FlowGraphEdge extends LogicFlow.EdgeData {
  properties: FlowGraphEdgePropertiesType;
}

export interface FlowGraphData extends LogicFlow.GraphData {
  nodes: FlowGraphNode[];
  edges: FlowGraphEdge[];
}

export const createFlowGraphNode = (tool: Tool): FlowGraphNode => {
  const inputSchema = tool.inputSchema;
  const outputSchema = tool.outputSchema;
  const inputJsonSchema = z.toJSONSchema(inputSchema);
  const outputJsonSchema = z.toJSONSchema(outputSchema);

  const inputNodeProperties =
    zodJsonSchemaToLogicFlowNodeProperties(inputJsonSchema);
  const outputNodeProperties =
    zodJsonSchemaToLogicFlowNodeProperties(outputJsonSchema);

  const node: FlowGraphNode = {
    id: `flow-node-${tool.name}-${uuidV4()}`,
    type: "tool-node",
    x: 0,
    y: 0,
    properties: {
      tableName: tool.name,
      inputFields: inputNodeProperties.fields,
      outputFields: outputNodeProperties.fields,
      data: {
        toolName: tool.name,
      },
    },
  };
  return node;
};
