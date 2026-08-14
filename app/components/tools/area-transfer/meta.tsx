import { isFunction } from "radash";
import { areaTransferMap, areaTypes } from "./utils";
import { defineTool } from "~/core/tool";
import { z } from "zod";

export const areaTransferTool = defineTool({
  name: "area-transfer",
  inputSchema: z.object({
    area: z.number().int().positive().describe("要转换的面积"),
    unit: z.enum(areaTypes).describe("面积单位"),
    targetUnit: z.enum(areaTypes).describe("目标面积单位"),
  }),
  outputSchema: z.object({
    area: z.number().int().positive().describe("转换后的面积"),
  }),
  run: (input) => {
    const { area, unit, targetUnit } = input;
    const km = areaTransferMap[unit].toKm(area);
    const targetArea = areaTransferMap[targetUnit].fromKm(km);
    return {
      area: targetArea,
    };
  },
});

export default defineToolMeta({
  title: "面积转换器",
  description: () => {
    const baseKm = 1;
    return (
      <span>
        <p>一个简单的面积转换器，支持的面积格式：</p>
        {Object.values(areaTransferMap).map((e) => {
          const example = e.fromKm(baseKm);
          return (
            <p>
              <span>
                &nbsp;&nbsp;&nbsp;&nbsp;
                {isFunction(e.label) ? e.label() : e.label}
              </span>
              :<span>{e.display(example)}</span>;
            </p>
          );
        })}
      </span>
    );
  },
  category: ToolCategory.unit,
});
