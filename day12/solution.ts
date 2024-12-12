import { getInputLineByLine } from "../utils/input";

type Region = {
  perimeter: number;
  areas: number[][];
};

type Region2 = {
  perimeter: number[][];
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

  return regions.reduce((acc, region) => {
    return acc + region.perimeter * region.areas.length;
  }, 0);
};

export const part2 = async () => {
  const text: string[] = await getInputLineByLine("example.txt");
  const grid = text.map((line) => Array.from(line));

  const inRegion = new Set<string>();
  const regions: Region[] = [];

  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[0].length; j++) {
      if (!inRegion.has(`${i},${j}`)) {
        regions.push(getRegion2(i, j, inRegion, grid));
      }
    }
  }

  return regions.reduce((acc, region) => {
    console.log(
      grid[region.areas[0][0]][region.areas[0][1]],
      region.areas.length,
      region.perimeter,
    );
    return acc + region.perimeter * region.areas.length;
  }, 0);
};

const getRegion2 = (
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

  const points: number[][] = [];
  perimeter.forEach((v) => {
    points.push(
      v
        .split(",")
        .filter((_, index) => index < 2)
        .map((n) => parseInt(n)),
    );
  });
  console.log(points);
  region.perimeter = 0;
  return region;
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

  console.log(perimeter);
  region.perimeter = perimeter[0].size + perimeter[1].size;
  return region;
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

// console.log(await part1());
console.log(await part2());
