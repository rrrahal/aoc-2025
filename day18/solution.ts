import { getInputLineByLine } from "../utils/input";

type Coord = {
  x: number;
  y: number;
};

export const part1 = async () => {
  const input: string[] = await getInputLineByLine("input.txt");
  const fallenBytes = input.map((t) => t.split(",").map((l) => parseInt(l)));

  const NUMBER_OF_FALLEN_BYTES = 1024;
  const MAX_LENGTH = 70;
  const path: string[][] = [];

  for (let i = 0; i <= MAX_LENGTH; i++) {
    path.push([]);
    for (let j = 0; j <= MAX_LENGTH; j++) {
      path[i].push(".");
    }
  }

  fallenBytes.forEach((byte, index) => {
    if (index < NUMBER_OF_FALLEN_BYTES) {
      path[byte[1]][byte[0]] = "#";
    }
  });
  // printGrid(path);
  // console.log("\n");

  const answer = search(path, { x: MAX_LENGTH, y: MAX_LENGTH });
  return answer;
};

const printGrid = (grid: string[][]) => {
  grid.forEach((g) => {
    console.log(g.join(""));
  });
};

const search = (grid: string[][], target: Coord) => {
  const seen: Set<string> = new Set();

  const q: [Coord, number][] = [[{ x: 0, y: 0 }, 0]];

  while (q.length > 0) {
    const n = q.shift();

    if (!n) {
      throw new Error();
    }

    const node = n[0];

    if (seen.has(`${node.x},${node.y}`)) {
      continue;
    }

    const dist = n[1];
    seen.add(`${node.x},${node.y}`);

    if (target.x === node.x && node.y === target.y) {
      return dist;
    }

    const neighbors = getNeighbors(grid, node, seen);
    neighbors.forEach((n) => {
      q.push([n, dist + 1]);
    });
  }

  return -1;
};

const getNeighbors = (grid: string[][], node: Coord, seen: Set<string>) => {
  const top = { x: node.x, y: node.y - 1 };
  const right = { x: node.x + 1, y: node.y };
  const bottom = { x: node.x, y: node.y + 1 };
  const left = { x: node.x - 1, y: node.y };

  return [top, right, bottom, left].filter(
    (n) => isNode(grid, n) && !seen.has(`${n.x},${n.y}`),
  );
};

const isNode = (grid: string[][], node: Coord) => {
  try {
    const value = grid[node.y][node.x];

    if (value === undefined) {
      return false;
    }
    return value !== "#";
  } catch (e) {
    return false;
  }
};

export const part2 = async () => {
  const input: string[] = await getInputLineByLine("input.txt");
  const fallenBytes = input.map((t) => t.split(",").map((l) => parseInt(l)));

  const MAX_LENGTH = 70;
  const path: string[][] = [];

  for (let i = 0; i <= MAX_LENGTH; i++) {
    path.push([]);
    for (let j = 0; j <= MAX_LENGTH; j++) {
      path[i].push(".");
    }
  }

  let i = 0;
  let answer = search(path, { x: MAX_LENGTH, y: MAX_LENGTH });
  while (answer !== -1) {
    const byte = fallenBytes[i];
    path[byte[1]][byte[0]] = "#";
    i++;
    answer = search(path, { x: MAX_LENGTH, y: MAX_LENGTH });
  }
  // printGrid(path);
  // console.log("\n");

  return fallenBytes[i - 1];
};

console.log(await part1());
console.log(await part2());
