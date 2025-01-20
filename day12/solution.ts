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

  console.log(regions[0]);
  return regions.reduce((acc, region) => {
    return acc + region.perimeter * region.areas.length;
  }, 0);
};

export const part2 = async () => {
  // I need to count the areas
  // and the vertices, because vertices === sides
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

  return regions.reduce((acc, r) => {
    return acc + r.areas.length * countSides(r.areas);
  }, 0);
};

const countSides = (area: number[][]) => {
  const up = new Set();
  const down = new Set();
  const right = new Set();
  const left = new Set();
  const points = new Set(area.map((a) => JSON.stringify(a)));

  area.forEach(([i, j]) => {
    const key = JSON.stringify([i, j]);
    if (!points.has(JSON.stringify([i - 1, j]))) {
      up.add(key);
    }
    if (!points.has(JSON.stringify([i + 1, j]))) {
      down.add(key);
    }
    if (!points.has(JSON.stringify([i, j - 1]))) {
      left.add(key);
    }
    if (!points.has(JSON.stringify([i, j + 1]))) {
      right.add(key);
    }
  });
  let count = 0;

  Array.from(up).forEach((item: number[]) => {
    if (left.has(item)) {
      count = count + 1;
    }
    if (right.has(item)) {
      count = count + 1;
    }
    const [i, j] = JSON.parse(item);
    if (right.has(JSON.stringify([i - 1, j - 1])) && !left.has(item)) {
      count = count + 1;
    }
    if (left.has(JSON.stringify([i - 1, j + 1])) && !right.has(item)) {
      count = count + 1;
    }
  });

  Array.from(down).forEach((item) => {
    if (left.has(item)) {
      count = count + 1;
    }
    if (right.has(item)) {
      count = count + 1;
    }
    const [i, j] = JSON.parse(item);
    if (right.has(JSON.stringify([i + 1, j - 1])) && !left.has(item)) {
      count = count + 1;
    }
    if (left.has(JSON.stringify([i + 1, j + 1])) && !right.has(item)) {
      count = count + 1;
    }
  });

  return count;
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
