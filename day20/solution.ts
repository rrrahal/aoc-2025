import { getInputLineByLine } from "../utils/input";

export const part1 = async () => {
  const input: string[] = await getInputLineByLine("input.txt");
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

  const raceTrackWay = bfs(startingPos, endPos, grid);
  const distances: Map<string, number> = new Map();
  raceTrackWay.forEach((pos, index) => {
    distances.set(`${pos}`, index);
  });
  const cheats = raceTrackWay.map((pos) => cheat(pos, 2, grid));
  const saved = cheats
    .map((c, i) => timeSaved(c, raceTrackWay[i], distances, 2))
    .flat()
    .filter((n) => n > 0);

  return saved.filter((t) => t >= 100).length;
};

const timeSaved = (
  finalPos: number[][],
  originalPos: number[],
  distances: Map<string, number>,
  cheatSteps: number,
) => {
  return finalPos.map((p) => {
    const original = distances.get(`${originalPos}`)! + cheatSteps;
    const saved = distances.get(`${p}`)!;
    return saved - original;
  });
};

const bfs = (start: number[], end: number[], grid: string[][]) => {
  const seen: Set<string> = new Set();
  const queue: [number[], number][] = [[start, 0]];
  const results: number[][] = [];

  while (queue.length) {
    const [node, dist] = queue.shift()!;
    if (node[0] === end[0] && node[1] === end[1]) {
      return results;
    }

    if (seen.has(`${node[0]},${node[1]}`)) {
      continue;
    }

    seen.add(`${node[0]},${node[1]}`);
    results.push(node);
    const neighbors = getNeighbors(node[0], node[1]).filter((n) =>
      isNode(n[0], n[1], grid, false),
    );

    neighbors.forEach((n) => {
      queue.push([n, dist + 1]);
    });
  }

  return results;
};

const cheat = (start: number[], cheatSteps: number, grid: string[][]) => {
  // given a start position and how many cheat steps, returns an array of all possible end positions
  let q = [start];
  const seen: Set<string> = new Set();
  while (cheatSteps > 1) {
    q.forEach((n) => {
      seen.add(`${n[0]},${n[1]}`);
    });
    q = q
      .map((n) =>
        getNeighbors(n[0], n[1])
          .filter((node) => getWall(node[0], node[1], grid))
          .filter((ne) => !seen.has(`${ne[0]},${ne[1]}`)),
      )
      .flat();
    cheatSteps--;
  }

  return q
    .map((n) =>
      getNeighbors(n[0], n[1]).filter(
        (node) =>
          isNode(node[0], node[1], grid) && !seen.has(`${node[0]},${node[1]}`),
      ),
    )
    .flat();
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
const getWall = (i: number, j: number, grid: string[][]) => {
  try {
    const el = grid[i][j];
    if (el === undefined) {
      return false;
    }
    return el === "#";
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

export const part2 = async () => {
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

  const raceTrackWay = bfs(startingPos, endPos, grid);
  const distances: Map<string, number> = new Map();
  raceTrackWay.forEach((pos, index) => {
    distances.set(`${pos}`, index);
  });
  // given all the points in the path
  // find all the reacheble point within 20s and their distance
  // calculate how many time we saved for each of them
};

// console.log(await part1());
console.log(await part2());
