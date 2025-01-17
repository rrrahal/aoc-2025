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
    .map((c, i) => timeSaved(c, raceTrackWay[i], distances))
    .flat()
    .filter((n) => n > 0);

  return saved.filter((t) => t >= 100).length;
};

const timeSaved = (
  finalPos: [number[], number][],
  originalPos: number[],
  distances: Map<string, number>,
) => {
  return finalPos.map((p) => {
    const original = distances.get(`${originalPos}`)! + p[1];
    const saved = distances.get(`${p[0]}`)!;
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
      return [...results, end];
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
  let q: number[][] = [start];
  let dist = 0;
  const results: [number[], number][] = [];
  const seen: Set<string> = new Set();
  seen.add(JSON.stringify(start));
  while (dist < cheatSteps) {
    dist++;
    const currentNodes = q;
    const newNodes = currentNodes
      .map((n) =>
        getNeighbors(n[0], n[1]).filter((nn) =>
          isNode(nn[0], nn[1], grid, true),
        ),
      )
      .filter((nnn) => !seen.has(JSON.stringify(nnn)))
      .flat();

    newNodes.forEach((n) => {
      seen.add(JSON.stringify(n));
      if (isNode(n[0], n[1], grid, false)) {
        results.push([n, dist]);
      }
    });

    q = newNodes;
  }

  return removeDuplicates(results, (item) => JSON.stringify(item));
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

const findPointsWithinDistance = (
  start: number[],
  distance: number,
  grid: string[][],
): [number[], number][] => {
  const [startX, startY] = start;
  const result: [number[], number][] = [];
  const rows = grid.length;
  const cols = grid[0]?.length || 0;

  for (let dx = -distance; dx <= distance; dx++) {
    const maxDy = distance - Math.abs(dx);
    for (let dy = -maxDy; dy <= maxDy; dy++) {
      const x = startX + dx;
      const y = startY + dy;

      if (x >= 0 && x < rows && y >= 0 && y < cols && grid[x][y] !== "#") {
        result.push([[x, y], Math.abs(dx) + Math.abs(dy)]);
      }
    }
  }

  return result;
};

const part2b = async () => {
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

  const cheats = raceTrackWay.map((pos) =>
    findPointsWithinDistance(pos, 20, grid),
  );
  const saved = cheats
    .map((c, i) => timeSaved(c, raceTrackWay[i], distances))
    .flat()
    .filter((n) => n > 0);

  return saved.filter((t) => t >= 100).length;
};

function removeDuplicates<T>(array: T[], keyFn: (item: T) => string): T[] {
  const seen = new Set<string>();
  return array.filter((item) => {
    const key = keyFn(item);
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
}

// console.log(await part1()); // 1365
console.log(await part2b());
