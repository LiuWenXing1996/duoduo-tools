import toolNode from "./tool-node";
import toolEdge from "./tool-edge";
import LogicFlow from "@logicflow/core";
import "@logicflow/core/es/index.css";

export const createToolFlow = (config: { container: HTMLElement }) => {
  const lf = new LogicFlow({
    container: config.container,
    grid: true,
    // isSilentMode: true,
  });

  lf.register(toolNode);
  lf.register(toolEdge);
  lf.setDefaultEdgeType("tool-edge");
  lf.on("anchor:dragstart", ({ data, nodeModel }: any) => {
    console.log("dragstart", data);
    if (nodeModel.type === "tool-node") {
      lf.graphModel.nodes.forEach((node) => {
        // @ts-ignore
        if (node.type === "tool-node" && nodeModel.id !== node.id) {
          node.isShowAnchor = true;
          node.setProperties({
            isConnection: true,
          });
        }
      });
    }
  });
  lf.on("anchor:dragend", ({ data, nodeModel }: any) => {
    console.log("dragend", data);
    if (nodeModel.type === "tool-node") {
      lf.graphModel.nodes.forEach((node) => {
        // @ts-ignore
        if (node.type === "tool-node" && nodeModel.id !== node.id) {
          node.isShowAnchor = false;
          lf.deleteProperty(node.id, "isConnection");
        }
      });
    }
  });
  return lf;
};
