import {
  BaseEdgeModel,
  HtmlNode,
  HtmlNodeModel,
  h,
  type IHtmlNodeProperties,
  type IHtmlNodeProps,
  type Model,
} from "@logicflow/core";
import type { ToolEdgeModel } from "./tool-edge";
// TODO:继续实现工具自定义节点
interface ToolNodeProps extends IHtmlNodeProps {
  model: ToolNodeModel;
}

class ToolNode extends HtmlNode<ToolNodeProps> {
  /**
   * 1.1.7版本后支持在view中重写锚点形状。
   * 重写锚点新增
   */
  override getAnchorShape(anchorData: Model.AnchorConfig) {
    const { x, y, type } = anchorData;
    return h("rect", {
      x: x - 5,
      y: y - 5,
      width: 10,
      height: 10,
      className: `custom-anchor ${
        type === "left" ? "incomming-anchor" : "outgoing-anchor"
      }`,
    });
  }

  override setHtml(rootEl: SVGForeignObjectElement) {
    rootEl.innerHTML = "";
    const {
      properties: { inputFields, outputFields, tableName },
    } = this.props.model;
    rootEl.setAttribute("class", "table-container");
    const container = document.createElement("div");
    container.className = `table-node table-color-${Math.ceil(
      Math.random() * 4,
    )}`;
    const tableNameElement = document.createElement("div");
    tableNameElement.innerText = tableName;
    tableNameElement.className = "table-name";
    container.appendChild(tableNameElement);
    const fieldsContainer = document.createElement("div");
    fieldsContainer.className = "table-fields-container";
    container.appendChild(fieldsContainer);
    const inputFieldsFragment = document.createElement("div");
    inputFieldsFragment.className = "table-fields";
    for (let i = 0; i < inputFields.length; i++) {
      const item = inputFields[i];
      if (!item) {
        continue;
      }
      const itemElement = document.createElement("div");
      itemElement.className = "table-feild";
      const itemKey = document.createElement("span");
      itemKey.innerText = item.key;
      const itemType = document.createElement("span");
      itemType.innerText = item.type;
      itemType.className = "feild-type";
      itemElement.appendChild(itemKey);
      itemElement.appendChild(itemType);
      inputFieldsFragment.appendChild(itemElement);
    }
    fieldsContainer.appendChild(inputFieldsFragment);
    const outputFieldsFragment = document.createElement("div");
    outputFieldsFragment.className = "table-fields";
    for (let i = 0; i < outputFields.length; i++) {
      const item = outputFields[i];
      if (!item) {
        continue;
      }
      const itemElement = document.createElement("div");
      itemElement.className = "table-feild";
      const itemKey = document.createElement("span");
      itemKey.innerText = item.key;
      const itemType = document.createElement("span");
      itemType.innerText = item.type;
      itemType.className = "feild-type";
      itemElement.appendChild(itemKey);
      itemElement.appendChild(itemType);
      outputFieldsFragment.appendChild(itemElement);
    }
    fieldsContainer.appendChild(outputFieldsFragment);
    rootEl.appendChild(container);
  }
}

export interface ToolNodeModelProperties extends IHtmlNodeProperties {
  fields: { key: string; type: string }[];
  inputFields: { key: string; type: string }[];
  outputFields: { key: string; type: string }[];
  tableName: string;
}

class ToolNodeModel extends HtmlNodeModel<ToolNodeModelProperties> {
  /**
   * 给model自定义添加字段方法
   */
  addField(item: { key: string; type: string }) {
    this.properties.fields.unshift(item);
    this.setAttributes();
    // 为了保持节点顶部位置不变，在节点变化后，对节点进行一个位移,位移距离为添加高度的一半。
    this.move(0, 24 / 2);
    // 更新节点连接边的path
    this.incoming.edges.forEach((edge: ToolEdgeModel) => {
      // 调用自定义的更新方案
      edge.updatePathByAnchor();
    });
    this.outgoing.edges.forEach((edge: ToolEdgeModel) => {
      // 调用自定义的更新方案
      edge.updatePathByAnchor();
    });
  }

  override getOutlineStyle() {
    const style = super.getOutlineStyle();
    style.stroke = "none";
    return style;
  }

  // 如果不用修改锚地形状，可以重写颜色相关样式
  override getAnchorStyle(anchorInfo: Model.AnchorConfig) {
    const style = super.getAnchorStyle();
    if (anchorInfo.type === "left") {
      style.fill = "red";
      style.className = "lf-hide-default";
    } else {
      style.fill = "green";
    }
    return style;
  }

  override setAttributes() {
    this.width = 200;
    const {
      properties: { inputFields, outputFields },
    } = this;
    this.height = 60 + inputFields.length * 24;
    const circleOnlyAsTarget = {
      message: "只允许从右边的锚点连出",
      validate: (sourceNode, targetNode, sourceAnchor) => {
        return sourceAnchor.type === "right";
      },
    };
    this.sourceRules.push(circleOnlyAsTarget);
    this.targetRules.push({
      message: "只允许连接左边的锚点",
      validate: (sourceNode, targetNode, sourceAnchor, targetAnchor) => {
        return targetAnchor.type === "left";
      },
    });
  }

  override getDefaultAnchor() {
    const {
      id,
      x,
      y,
      width,
      height,
      isHovered,
      isSelected,
      properties: { fields, inputFields, outputFields, isConnection },
    } = this;
    const anchors: Model.AnchorConfig[] = [];
    inputFields.forEach((field, index) => {
      anchors.push({
        x: x - width / 2 + 10,
        y: y - height / 2 + 60 + index * 24,
        id: `${id}_${field.key}_left`,
        edgeAddable: false,
        type: "left",
      });
    });
    outputFields.forEach((field, index) => {
      anchors.push({
        x: x + width / 2 - 10,
        y: y - height / 2 + 60 + index * 24,
        id: `${id}_${field.key}_right`,
        type: "right",
      });
    });
    // fields.forEach((feild, index) => {
    //   // 如果是连出，就不显示左边的锚点
    //   if (isConnection || !(isHovered || isSelected)) {
    //     anchors.push({
    //       x: x - width / 2 + 10,
    //       y: y - height / 2 + 60 + index * 24,
    //       id: `${id}_${feild.key}_left`,
    //       edgeAddable: false,
    //       type: "left",
    //     });
    //   }
    //   if (!isConnection) {
    //     anchors.push({
    //       x: x + width / 2 - 10,
    //       y: y - height / 2 + 60 + index * 24,
    //       id: `${id}_${feild.key}_right`,
    //       type: "right",
    //     });
    //   }
    // });
    return anchors;
  }
}

export default {
  type: "tool-node",
  model: ToolNodeModel,
  view: ToolNode,
};
