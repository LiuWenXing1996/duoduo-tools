import { isFunction } from "radash";
import { areaTransferMap } from "./utils";

export default defineToolMeta({
  title: "面积转换器",
  description: () => {
    const baseKm = 1;
    return (
      <span>
        <p>一个简单的面积转换器，支持的面积格式：</p>
        {Object.values(areaTransferMap).map((e) => {
          const example = e.formKm(baseKm);
          return (
            <p>
              <span>
                &nbsp;&nbsp;&nbsp;&nbsp;
                {isFunction(e.label) ? e.label() : e.label}
              </span>
              :<span>{e.display(example)}</span>
            </p>
          );
        })}
      </span>
    );
  },
  category: ToolCategory.unit,
});
