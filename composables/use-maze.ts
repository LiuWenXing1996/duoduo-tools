import { random, range, shuffle } from "radash";

export class MazePoint {
  row: number;
  col: number;
  constructor(params: { row: number; col: number }) {
    this.row = params.row;
    this.col = params.col;
  }
}

export class MazeDraw {
  canvas: HTMLCanvasElement;
  maze: Maze;
  margin = 10;
  space = 10;
  get ctx() {
    const ctx = this.canvas.getContext("2d");
    if (!ctx) {
      throw new Error("undefined ctx");
    }
    return ctx;
  }
  constructor(canvas: HTMLCanvasElement, maze: Maze) {
    this.canvas = canvas;
    this.maze = maze;
    this.init();
  }

  init() {
    const canvas = this.canvas;
    const row = this.maze.row;
    const col = this.maze.col;
    const space = this.space;
    const margin = this.margin;
    canvas.width = col * 2 * space + margin * 2;
    canvas.height = row * 2 * space + margin * 2;
  }
  calcPointPxLocate(point: MazePoint) {
    const space = this.space;
    return {
      x: point.col * 2 * space,
      y: point.row * 2 * space,
    };
  }
  drawBg(color: string) {
    const ctx = this.ctx;
    const canvas = this.canvas;
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
  drawPoint(point: MazePoint, color: string) {
    const ctx = this.ctx;
    const pxLocate = this.calcPointPxLocate(point);
    ctx.beginPath();
    ctx.fillStyle = color;
    ctx.arc(pxLocate.x, pxLocate.y, 2, 0, Math.PI * 2);
    ctx.fill();
  }
  drawPointAll(color: string) {
    const row = this.maze.row;
    const col = this.maze.col;
    for (let rowIndex = 1; rowIndex <= row; rowIndex++) {
      for (let colIndex = 1; colIndex <= col; colIndex++) {
        const point = new MazePoint({ row: rowIndex, col: colIndex });
        this.drawPoint(point, color);
      }
    }
  }
  drawRoute(p1: MazePoint, p2: MazePoint, color: string) {
    const ctx = this.ctx;
    const p1PxLocate = this.calcPointPxLocate(p1);
    const p2PxLocate = this.calcPointPxLocate(p2);
    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.moveTo(p1PxLocate.x, p1PxLocate.y);
    ctx.lineTo(p2PxLocate.x, p2PxLocate.y);
    ctx.closePath();
    ctx.stroke();
  }
  drawRouteAll(color: string) {
    const edgesMap = this.maze.edges;
    for (const edges of edgesMap) {
      const [v1, v1Edges] = edges;
      const v1Obj = this.maze.parserVertex(v1);
      for (const v2 of v1Edges) {
        const v2Obj = this.maze.parserVertex(v2);
        const p1 = new MazePoint(v1Obj);
        const p2 = new MazePoint(v2Obj);
        this.drawRoute(p1, p2, color);
      }
    }
  }
  drawWall(p1: MazePoint, p2: MazePoint, color: string) {
    const ctx = this.ctx;
    const p1PxLocate = this.calcPointPxLocate(p1);
    const p2PxLocate = this.calcPointPxLocate(p2);
    const space = this.space;
    ctx.beginPath();
    ctx.strokeStyle = color;
    if (p1PxLocate.x === p2PxLocate.x && p1PxLocate.y !== p2PxLocate.y) {
      const y = (p1PxLocate.y + p2PxLocate.y) / 2;
      ctx.moveTo(p1PxLocate.x - space, y);
      ctx.lineTo(p1PxLocate.x + space, y);
    }
    if (p1PxLocate.y === p2PxLocate.y && p1PxLocate.x !== p2PxLocate.x) {
      const x = (p1PxLocate.x + p2PxLocate.x) / 2;
      ctx.moveTo(x, p1PxLocate.y - space);
      ctx.lineTo(x, p1PxLocate.y + space);
    }
    ctx.closePath();
    ctx.stroke();
  }
  drawFrameWall(color: string) {
    const ctx = this.ctx;
    const margin = this.margin;
    const space = this.space;
    const row = this.maze.row;
    const col = this.maze.col;
    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.moveTo(margin, margin);
    ctx.lineTo(margin + col * 2 * space, margin);
    ctx.lineTo(margin + col * 2 * space, margin + row * 2 * space);
    ctx.lineTo(margin, margin + row * 2 * space);
    ctx.closePath();
    ctx.stroke();
  }
  drawWallAll(color: string) {
    const row = this.maze.row;
    const col = this.maze.col;
    for (let rowIndex = 1; rowIndex <= row; rowIndex++) {
      for (let colIndex = 1; colIndex <= col; colIndex++) {
        const v1 = this.maze.makeVertex(rowIndex, colIndex);
        const v1Obj = { row: rowIndex, col: colIndex };
        const neighbors = this.maze.getNeighbors(v1);
        const neighborList = Object.entries(neighbors)
          .map(([key, value]) => {
            return {
              key,
              value,
            };
          })
          .filter((e) => {
            if (!e.value) {
              return false;
            }
            return true;
          });
        for (const neighbor of neighborList) {
          if (neighbor.value) {
            if (!this.maze.hasEdge(v1, neighbor.value)) {
              const v2Obj = this.maze.parserVertex(neighbor.value);
              this.drawWall(new MazePoint(v1Obj), new MazePoint(v2Obj), color);
            }
          }
        }
      }
    }
    this.drawFrameWall(color);
  }
  drawResolution(color: string) {
    const resolution = this.maze.resolution;
    for (let index = 0; index < resolution.length - 1; index++) {
      const v1 = resolution[index];
      const v2 = resolution[index + 1];
      const v1Obj = this.maze.parserVertex(v1);
      const v2Obj = this.maze.parserVertex(v2);
      this.drawRoute(new MazePoint(v1Obj), new MazePoint(v2Obj), color);
    }
  }
}

export class Maze {
  vertexes: string[] = [];
  edges = new Map<string, string[]>();
  row: number;
  col: number;
  resolution: string[] = [];
  constructor(row: number, col: number) {
    this.row = row;
    this.col = col;
  }
  addVertex(v: string) {
    if (!this.vertexes.includes(v)) {
      this.vertexes.push(v);
    }
  }
  addEdge(v1: string, v2: string) {
    this.addLink(v1, v2);
    this.addLink(v2, v1);
  }
  hasEdge(v1: string, v2: string) {
    return this.edges.get(v1)?.includes(v2) || this.edges.get(v2)?.includes(v1);
  }
  addLink(from: string, to: string) {
    this.addVertex(from);
    this.addVertex(to);
    const fromEdges = this.edges.get(from) || [];
    if (!fromEdges.includes(to)) {
      fromEdges.push(to);
    }
    this.edges.set(from, fromEdges);
  }
  makeVertex(row: number, col: number) {
    return `${row},${col}`;
  }
  parserVertex(vertex: string) {
    const [row, col] = vertex.split(",").map((e) => Number(e));
    return {
      row,
      col,
    };
  }
  initializeColor() {
    const colors: Record<string, "white" | "gray" | "black"> = {};
    for (let rowIndex = 1; rowIndex <= this.row; rowIndex++) {
      for (let colIndex = 1; colIndex <= this.col; colIndex++) {
        const v = this.makeVertex(rowIndex, colIndex);
        colors[v] = "white";
      }
    }
    return colors;
  }
  getNeighbors(v: string) {
    const { row, col } = this.parserVertex(v);
    return {
      top: row > 1 ? this.makeVertex(row - 1, col) : undefined,
      bottom: row < this.row ? this.makeVertex(row + 1, col) : undefined,
      left: col > 1 ? this.makeVertex(row, col - 1) : undefined,
      right: col < this.col ? this.makeVertex(row, col + 1) : undefined,
    };
  }
  dfsGenerate() {
    const colors = this.initializeColor();
    let resolution: string[] = [];
    const gen = (v: string, list: string[]) => {
      colors[v] = "gray";
      list.push(v);
      if (v === this.makeVertex(this.row, this.col)) {
        if (list[0] === this.makeVertex(1, 1)) {
          resolution = [...list];
        }
      }
      const neighbors = this.getNeighbors(v);
      const neighborList = Object.entries(neighbors)
        .map(([key, value]) => {
          return {
            key,
            value,
          };
        })
        .filter((e) => {
          if (!e.value) {
            return false;
          }
          if (colors[e.value] !== "white") {
            return false;
          }
          return true;
        });

      if (neighborList.length > 0) {
        const nextIndexList = shuffle(
          Array.from(range(0, neighborList.length - 1))
        );
        for (
          let nextIndexListIndex = 0;
          nextIndexListIndex < nextIndexList.length;
          nextIndexListIndex++
        ) {
          const nextIndex = nextIndexList[nextIndexListIndex];
          const next = neighborList[nextIndex].value as string;
          if (colors[next] === "white") {
            this.addEdge(v, next);
            gen(next, [...list]);
          }
        }
      }
      colors[v] = "black";
    };
    gen(this.makeVertex(1, 1), []);
    this.resolution = [...resolution];
  }
  draw(
    canvas: HTMLCanvasElement,
    options: {
      bgColor: string;
      wall: {
        isDraw: boolean;
        color: string;
      };
      point: {
        isDraw: boolean;
        color: string;
      };
      resolution: {
        isDraw: boolean;
        color: string;
      };
    }
  ) {
    const draw = new MazeDraw(canvas, this);
    draw.drawBg(options.bgColor);
    if (options.point.isDraw) {
      draw.drawPointAll(options.point.color);
    }
    if (options.wall.isDraw) {
      draw.drawWallAll(options.wall.color);
    }
    if (options.resolution.isDraw) {
      draw.drawResolution(options.resolution.color);
    }
  }
}

export const useMaze = () => {
  const gen = (params: { row: number; col: number }) => {
    const maze = new Maze(params.row, params.col);
    maze.dfsGenerate();
    return maze;
  };

  return {
    gen,
  };
};
