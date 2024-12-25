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
  const [map, points] = makeMap(grid, startingPos, endPos);
  const maxDis = points[points.length - 1][2];
  console.log(">>>", points);

  const cheating: number[] = [];
  for (let i = 0; i < points.length; i++) {
    const dist =
      maxDis - (points[i][2] - points[getCheated(grid, points[i], map)][2]);

    cheating.push(dist);
  }

  console.log(cheating);
  console.log(getCheated(grid, [2, 1], map));
};

const printGrid = (grid: string[][]) => {
  grid.forEach((row) => {
    console.log(row.join(""));
  });
};

const makeMap = (
  grid: string[][],
  start: number[],
  end: number[],
): [Map<string, number>, number[][]] => {
  const seen: Set<string> = new Set();
  const q: number[][] = [[...start, 0]];
  let map: Map<string, number> = new Map();
  const points: number[][] = [];

  while (q.length > 0) {
    const node = q.shift();
    if (!node) {
      continue;
    }
    if (seen.has(`${node[0]},${node[1]}`)) {
      continue;
    }

    if (node[0] === end[0] && node[1] === end[1]) {
      map.set(`${node[0]},${node[1]}`, node[2]);
      points.push(node);
      return [map, points];
    }

    seen.add(`${node[0]},${node[1]}`);
    map.set(`${node[0]},${node[1]}`, node[2]);
    points.push(node);
    const neighbors = getNeighbors(node[0], node[1])
      .filter((n) => isNode(n[0], n[1], grid))
      .map((n) => [...n, node[2] + 1]);

    q.push(...neighbors);
  }

  return [map, points];
};

const getCheated = (
  grid: string[][],
  start: number[],
  map: Map<string, number>,
) => {
  const neighbors = getNeighbors(start[0], start[1]).filter((n) =>
    isNode(n[0], n[1], grid, true),
  );

  const finalPos = neighbors
    .map((n) => {
      const nei = getNeighbors(n[0], n[1]).filter((final) =>
        isNode(final[0], final[1], grid),
      );
      return nei;
    })
    .flat();

  return finalPos.reduce((acc, pos) => {
    if (map.get(`${pos[0]},${pos[1]}`) === undefined) {
      return acc;
    }
    return Math.max(acc, map.get(`${pos[0]},${pos[1]}`));
  }, -1);
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
