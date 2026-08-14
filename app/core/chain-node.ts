import { TinyEmitter } from "tiny-emitter";
import { v4 as uuidV4 } from "uuid";
import type { Tool } from "./tool";

export class ChainNode {
  private _id: string;
  private _tool?: Tool;
  private _input = new Map<string, { nodeId: string; outputKey: string }>();
  private _emitter = new TinyEmitter();
  private _flowNodeID: string;
  constructor(flowNodeID: string) {
    this._id = flowNodeID;
    this._flowNodeID = flowNodeID;
  }
  setTool(tool: Tool) {
    this._tool = tool;
  }
  getDependIds() {
    const ids = Array.from(this._input.values()).map((item) => item.nodeId);
    return ids;
  }
  get id() {
    return this._id;
  }
  get flowNodeID() {
    return this._flowNodeID;
  }
  on<E extends ChainNodeEvent>(
    event: E,
    callback: (payload: ChainNodeEventMap[E]) => void,
  ) {
    this._emitter.on(event, callback);
  }
  private _emit<E extends ChainNodeEvent>(
    event: E,
    payload: ChainNodeEventMap[E],
  ): void {
    this._emitter.emit(event, payload);
  }

  run(payload: unknown) {
    this._emit(ChainNodeEvent.start, {
      node: this,
      timestamp: Date.now(),
    });
    let result: unknown = undefined;
    let _error: Error | undefined = undefined;
    try {
      result = this._tool?.run(payload);
    } catch (error) {
      _error = error as Error;
    }
    this._emit(ChainNodeEvent.finish, {
      node: this,
      timestamp: Date.now(),
      returns: {
        success: !_error,
        error: _error,
        result,
      },
    });
  }
  addInput(key: string, nodeId: string, outputKey: string) {
    this._input.set(key, { nodeId, outputKey });
  }

  get input() {
    return this._input;
  }
}

export const ChainNodeEvent = {
  start: "start",
  finish: "finish",
} as const;
export type ChainNodeEvent =
  (typeof ChainNodeEvent)[keyof typeof ChainNodeEvent];
export interface ChainNodeEventMap {
  start: { node: ChainNode; timestamp: number };
  finish: { node: ChainNode; timestamp: number; returns: ChainNodeReturns };
}

export interface ChainNodeReturns {
  success: boolean;
  error?: Error;
  result?: unknown;
}
