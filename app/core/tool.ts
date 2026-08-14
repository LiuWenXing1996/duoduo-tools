import { z } from "zod";

export interface Tool<
  I extends z.ZodObject = z.ZodObject,
  O extends z.ZodObject = z.ZodObject,
> {
  name: string;
  inputSchema: I;
  outputSchema: O;
  run: (inputs: z.infer<I>) => z.infer<O>;
}

export const defineTool = <I extends z.ZodObject, O extends z.ZodObject>(
  tool: Tool<I, O>,
): Tool<I, O> => tool;

export const zodJsonSchemaToLogicFlowNodeProperties = (schemaData: any) => {
  // 从 JSON Schema 中提取字段信息
  const properties = schemaData.properties || {};
  const schemaFields = Object.keys(properties).map((key) => ({
    key,
    label: properties[key].description || key,
    type: properties[key].type,
  }));

  // 构造 LogicFlow 节点数据
  return {
    fields: schemaFields,
  };
};
