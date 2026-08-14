import LogicFlow, { BezierEdge, BezierEdgeModel } from "@logicflow/core";

export class ToolEdge extends BezierEdge {}

export class ToolEdgeModel extends BezierEdgeModel {
  override getEdgeStyle() {
    const style = super.getEdgeStyle();
    // svg属性
    style.strokeWidth = 1;
    style.stroke = "#ababac";
    return style;
  }

  /**
   * 重写此方法，使保存数据是能带上锚点数据。
   */
  override getData() {
    const data = super.getData();
    data.sourceAnchorId = this.sourceAnchorId;
    data.targetAnchorId = this.targetAnchorId;

    if (this.sourceAnchorId) {
      const sourceNode = this.graphModel.getNodeModelById(this.sourceNodeId);
      if (sourceNode) {
        // 从节点的锚点数据中查找对应的锚点
        const anchorData = sourceNode.anchors?.find(
          (anchor) => anchor.id === this.sourceAnchorId,
        );
        if (anchorData) {
          // 将锚点的业务数据合并到边的properties中，或者单独存储
          data.properties = data.properties || {};
          data.properties.data = data.properties.data || {};
          data.properties.data.sourceKey = anchorData.name;
        }
      }
    }
    if (this.targetAnchorId) {
      const targetNode = this.graphModel.getNodeModelById(this.targetNodeId);
      if (targetNode) {
        // 从节点的锚点数据中查找对应的锚点
        const anchorData = targetNode.anchors?.find(
          (anchor) => anchor.id === this.targetAnchorId,
        );
        if (anchorData) {
          // 将锚点的业务数据合并到边的properties中，或者单独存储
          data.properties = data.properties || {};
          data.properties.data = data.properties.data || {};
          data.properties.data.targetKey = anchorData.name;
        }
      }
    }

    return data;
  }

  /**
   * 给边自定义方案，使其支持基于锚点的位置更新边的路径
   */
  updatePathByAnchor() {
    // TODO
    const sourceNodeModel = this.graphModel.getNodeModelById(this.sourceNodeId);
    const sourceAnchor = sourceNodeModel
      ?.getDefaultAnchor()
      .find((anchor) => anchor.id === this.sourceAnchorId);
    const targetNodeModel = this.graphModel.getNodeModelById(this.targetNodeId);
    const targetAnchor = targetNodeModel
      ?.getDefaultAnchor()
      .find((anchor) => anchor.id === this.targetAnchorId);

    if (sourceAnchor) {
      const startPoint: LogicFlow.Point = {
        x: sourceAnchor?.x,
        y: sourceAnchor?.y,
      };
      this.updateStartPoint(startPoint);
    }
    if (targetAnchor) {
      const endPoint: LogicFlow.Point = {
        x: targetAnchor?.x,
        y: targetAnchor?.y,
      };
      this.updateEndPoint(endPoint);
    }
    // 这里需要将原有的pointsList设置为空，才能触发bezier的自动计算control点。
    this.pointsList = [];
    this.initPoints();
  }
}

export default {
  type: "tool-edge",
  view: ToolEdge,
  model: ToolEdgeModel,
};
