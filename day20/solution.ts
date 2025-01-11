import { getInputLineByLine } from "../utils/input";

export const part1 = async () => {
  const input: string[] = await getInputLineByLine("example.txt");
  const grid = input.map((l) => Array.from(l));
  const startingPos: number[] = [];
  const endPos: number[] = [];
  for (let i = 0; i < input.length; i++) {
    for (let j = 0; j < input[0].length; j++) {
      const element = input[i][j];
      if (element === "S") {
        startingPos.push(i, j);
      }
      if (element === "E") {
        endPos.push(i, j);
      }
    }
  }

  // const normalValue = bfs(startingPos, endPos, grid, -1);
  // const cheats: number[] = [];
  // for (let i = 0; i < normalValue; i++) {
  //   cheats.push(bfs(startingPos, endPos, grid, i));
  // }

  const test = bfs(startingPos, endPos, grid, 20);
  console.log(test);
  // console.log(cheats);
};

const bfs = (
  start: number[],
  end: number[],
  grid: string[][],
  cheatDist: number,
) => {
  const seen: Set<string> = new Set();
  const queue: [number[], number][] = [[start, 0]];
  const results: number[] = [];

  while (queue.length) {
    const [node, dist] = queue.shift()!;
    if (node[0] === end[0] && node[1] === end[1]) {
      results.push(dist);
    }

    if (seen.has(`${node[0]},${node[1]}`)) {
      continue;
    }

    seen.add(`${node[0]},${node[1]}`);
    if (cheatDist === dist) {
      printGrid(grid, node);
    }
    const neighbors = getNeighbors(node[0], node[1]).filter((n) =>
      isNode(n[0], n[1], grid, cheatDist === dist),
    );

    neighbors.forEach((n) => {
      queue.push([n, dist + 1]);
    });
  }

  return results;
};

const printGrid = (grid: string[][], pos: number[]) => {
  const copy = [...grid];
  copy[pos[0]][pos[1]] = "!";
  copy.map((l) => console.log(l.join("")));
};

const isNode = (
  i: number,
  j: number,
  grid: string[][],
  cheat: boolean = false,
) => {
  try {
    const el = grid[i][j];
    if (el === undefined) {
      return false;
    }
    if (cheat) {
      return true;
    }
    return el !== "#";
  } catch (e) {
    return false;
  }
};

const getNeighbors = (i: number, j: number): number[][] => {
  return [
    [i + 1, j],
    [i - 1, j],
    [i, j + 1],
    [i, j - 1],
  ];
};

console.log(await part1());
