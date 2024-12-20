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

  const cheating: number[] = [];

  const maxTime = search(grid, startingPos, endPos);
  console.log(maxTime);
  for (let i = 0; i <= maxTime; i++) {
    const res = search(grid, startingPos, endPos, i);
    cheating.push(res);
  }

  const debug = {};
  cheating
    .filter((c) => c !== maxTime)
    .forEach((c) => {
      if (debug[maxTime - c]) {
        debug[maxTime - c] += 1;
      } else {
        debug[maxTime - c] = 1;
      }
    });

  console.log(debug, cheating);
};

const printGrid = (grid: string[][]) => {
  grid.forEach((row) => {
    console.log(row.join(""));
  });
};

const search = (
  grid: string[][],
  start: number[],
  end: number[],
  cheat: number = -5,
) => {
  const seen: Set<string> = new Set();
  const q: number[][] = [[...start, 0]];

  while (q.length > 0) {
    const node = q.shift();
    if (!node) {
      continue;
    }
    if (!isNode(node[0], node[1], grid, node[2] === cheat + 1)) {
      continue;
    }

    if (seen.has(`${node[0]},${node[1]}`)) {
      continue;
    }
    if (node[2] === cheat + 2 && grid[node[0]][node[1]] !== ".") {
      continue;
    }

    if (node[0] === end[0] && node[1] === end[1]) {
      return node[2];
    }

    seen.add(`${node[0]},${node[1]}`);

    const neighbors = getNeighbors(node[0], node[1]).map((n) => [
      ...n,
      node[2] + 1,
    ]);

    q.push(...neighbors);
  }

  return -1;
};

const isNode = (
  i: number,
  j: number,
  grid: string[][],
  cheat: boolean = false,
) => {
  try {
    const el = grid[i][j];
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
