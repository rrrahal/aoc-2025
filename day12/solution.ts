import { getInputLineByLine } from "../utils/input";

type Region = {
  perimeter: number;
  areas: number[][];
};

export const part1 = async () => {
  const text: string[] = await getInputLineByLine("input.txt");
  const grid = text.map((line) => Array.from(line));

  const inRegion = new Set<string>();
  const regions: Region[] = [];

  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[0].length; j++) {
      if (!inRegion.has(`${i},${j}`)) {
        regions.push(getRegion(i, j, inRegion, grid));
      }
    }
  }

  console.log(regions);
  return regions.reduce((acc, region) => {
    return acc + region.perimeter * region.areas.length;
  }, 0);
};

export const part2 = async () => {
  const text: string[] = await getInputLineByLine("example.txt");
  const grid = text.map((line) => Array.from(line));

  const inRegion = new Set<string>();
  const regions: any[] = [];

  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[0].length; j++) {
      if (!inRegion.has(`${i},${j}`)) {
        regions.push(getRegion2(i, j, inRegion, grid));
      }
    }
  }

  return regions.reduce((acc, r) => {
    const edges = findEdges(r.perimeter, r.areas);
    console.log(edges);
    return acc + r.areas.length * edges.size;
  }, 0);
};

const getRegion = (
  i: number,
  j: number,
  inRegion: Set<string>,
  grid: string[][],
) => {
  const currentRegion = grid[i][j];
  const perimeter = new Set<string>();
  const region: Region = {
    perimeter: 0,
    areas: [],
  };
  inRegion.add(`${i},${j}`);
  region.areas.push([i, j]);
  const n = getNeighbors(i, j, currentRegion, grid, inRegion, perimeter);
  while (n.length > 0) {
    const node = n.shift();
    if (!node || inRegion.has(`${node[0]},${node[1]}`)) {
      continue;
    }
    inRegion.add(`${node[0]},${node[1]}`);
    region.areas.push(node);
    const neighbors = getNeighbors(
      node[0],
      node[1],
      currentRegion,
      grid,
      inRegion,
      perimeter,
    );
    n.push(...neighbors);
  }

  region.perimeter = perimeter.size;
  return region;
};

const getRegion2 = (
  i: number,
  j: number,
  inRegion: Set<string>,
  grid: string[][],
) => {
  const currentRegion = grid[i][j];
  const perimeter = [] as number[][];
  const region = {
    perimeter: [] as number[][],
    areas: [] as number[][],
  };
  inRegion.add(`${i},${j}`);
  region.areas.push([i, j]);
  const n = getNeighbors2(i, j, currentRegion, grid, inRegion, perimeter);
  while (n.length > 0) {
    const node = n.shift();
    if (!node || inRegion.has(`${node[0]},${node[1]}`)) {
      continue;
    }
    inRegion.add(`${node[0]},${node[1]}`);
    region.areas.push(node);
    const neighbors = getNeighbors2(
      node[0],
      node[1],
      currentRegion,
      grid,
      inRegion,
      perimeter,
    );
    n.push(...neighbors);
  }

  region.perimeter = perimeter;
  return region;
};
const getNeighbors2 = (
  i: number,
  j: number,
  currentRegion: string,
  grid: string[][],
  inRegion: Set<string>,
  perimeter: number[][],
) => {
  const up = [i + 1, j];
  const down = [i - 1, j];
  const right = [i, j + 1];
  const left = [i, j - 1];

  return [up, down, right, left].filter((el) => {
    try {
      if (
        grid[el[0]][el[1]] === currentRegion &&
        !inRegion.has(`${el[0]},${el[1]}`)
      ) {
        return true;
      }
      if (grid[el[0]][el[1]] !== currentRegion) {
        perimeter.push([el[0], el[1]]);
      }
      return false;
    } catch (e) {
      perimeter.push([el[0], el[1]]);
      return false;
    }
  });
};

const getNeighbors = (
  i: number,
  j: number,
  currentRegion: string,
  grid: string[][],
  inRegion: Set<string>,
  perimeter: Set<string>,
) => {
  const up = [i + 1, j];
  const down = [i - 1, j];
  const right = [i, j + 1];
  const left = [i, j - 1];

  return [up, down, right, left].filter((el) => {
    try {
      if (
        grid[el[0]][el[1]] === currentRegion &&
        !inRegion.has(`${el[0]},${el[1]}`)
      ) {
        return true;
      }
      if (grid[el[0]][el[1]] !== currentRegion) {
        perimeter.add(`${el[0]},${el[1]},${i},${j}`);
      }
      return false;
    } catch (e) {
      perimeter.add(`${el[0]},${el[1]},${i},${j}`);
      return false;
    }
  });
};

const findEdges = (perimeter: number[][], region: number[][]) => {
  const edges = new Set<string>();
  const inPerimeter = new Set<string>();
  const inRegion = new Set<string>();

  perimeter.forEach((p) => {
    inPerimeter.add(`${p[0]},${p[1]}`);
  });

  region.forEach((r) => {
    inRegion.add(`${r[0]},${r[1]}`);
  });

  perimeter.forEach((p) => {
    const isTop = inRegion.has(`${p[0] - 1},${p[1]}`);
    const isBottom = inRegion.has(`${p[0] + 1},${p[1]}`);
    const isRight = inRegion.has(`${p[0]},${p[1] + 1}`);
    const isLeft = inRegion.has(`${p[0]},${p[1] - 1}`);

    if ((isTop && (isLeft || isRight)) || (isBottom && (isLeft || isRight))) {
      if ([isRight, isLeft, isBottom, isTop].filter((t) => t).length > 2) {
        edges.add(`${p[0]},${p[1]}`);
        edges.add(`${p[0]},${p[1]}-`);
        return;
      }
      edges.add(`${p[0]},${p[1]}`);
      return;
    }

    if (isTop || isBottom) {
      if (!inPerimeter.has(`${p[0]},${p[1] - 1}`)) {
        edges.add(`${p[0]},${p[1] - 1}`);
      }
      if (!inPerimeter.has(`${p[0]},${p[1] + 1}`)) {
        edges.add(`${p[0]},${p[1] + 1}`);
      }
    }
    if (isRight || isLeft) {
      if (!inPerimeter.has(`${p[0] + 1},${p[1]}`)) {
        edges.add(`${p[0] + 1},${p[1]}`);
      }
      if (!inPerimeter.has(`${p[0] - 1},${p[1]}`)) {
        edges.add(`${p[0] - 1},${p[1]}`);
      }
    }
  });

  return edges;
};

// console.log(await part1());
console.log(await part2());
