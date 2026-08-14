import {
  ChainNodeEvent,
  type ChainNode,
  type ChainNodeReturns,
} from "./chain-node";
import { v4 as uuidV4 } from "uuid";

export class ChainRecord {
  private _id: string;
  private _records: {
    time: number;
    node: ChainNode;
    description: string;
    returns?: ChainNodeReturns;
  }[] = [];
  private _nodes: ChainNode[] = [];
  private _nodesState = new Map<string, ChainNodeState>();
  private _nodesResult = new Map<string, unknown>();
  constructor(nodes: ChainNode[]) {
    this._id = `chain-record-${uuidV4()}`;
    this._nodes = [...nodes];
  }
  get id() {
    return this._id;
  }
  get records() {
    return [...this._records];
  }

  getNode(id: string) {
    return this._nodes.find((item) => item.id === id);
  }
  tryRunNode(id: string) {
    const node = this.getNode(id);
    if (!node) {
      return;
    }
    const state = this._nodesState.get(id);
    if (state !== ChainNodeState.wait) {
      return;
    }
    const dependsIds = node.getDependIds();
    if (dependsIds.length <= 0) {
      node.run({});
      return;
    }
    const dependsAllFinished = dependsIds.every(
      (item) => this._nodesState.get(item) === ChainNodeState.finished,
    );
    if (dependsAllFinished) {
      // 构造输入参数
      const input: Record<string, unknown> = {};
      Array.from(node.input.entries()).map(([key, value]) => {
        const dependNodeId = value.nodeId;
        const outputKey = value.outputKey;
        const dependNodeResult = this._nodesResult.get(dependNodeId);
        let outValue = undefined;
        try {
          outValue = ((dependNodeResult || {}) as Record<string, unknown>)[
            outputKey
          ];
        } catch (error) {
          console.error("依赖节点输出结果错误", error);
        }
        input[key] = outValue;
      });
      node.run(input);
      return;
    }
  }
  run() {
    // 初始化节点状态
    this._nodes.map((item) => {
      this._nodesState.set(item.id, ChainNodeState.wait);
    });
    // 注册事件
    this._nodes.map((item) => {
      item.on(ChainNodeEvent.start, (payload) => {
        this._nodesState.set(item.id, ChainNodeState.pending);
        this._records.push({
          time: payload.timestamp,
          node: item,
          description: "开始执行",
        });
      });
      item.on(ChainNodeEvent.finish, (payload) => {
        this._nodesState.set(item.id, ChainNodeState.finished);
        this._records.push({
          time: payload.timestamp,
          node: payload.node,
          description: "执行完成",
          returns: payload.returns,
        });
        this._nodesResult.set(item.id, payload.returns.result);
      });
    });
    // 监听依赖节点的完成事件
    this._nodes.map((item) => {
      const dependsIds = item.getDependIds();
      dependsIds.map((depend) => {
        const dependNode = this.getNode(depend);
        if (dependNode) {
          dependNode.on(ChainNodeEvent.finish, () => {
            this.tryRunNode(item.id);
          });
        }
      });
    });
    // 尝试运行每个节点
    this._nodes.map((item) => {
      this.tryRunNode(item.id);
    });
  }
}
export const ChainNodeState = {
  wait: "wait",
  pending: "pending",
  finished: "finished",
} as const;
export type ChainNodeState =
  (typeof ChainNodeState)[keyof typeof ChainNodeState];
