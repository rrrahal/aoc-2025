import { getInputLineByLine } from "../utils/input";

type Point = {
  x: number;
  y: number;
};

function getAllPairs(points: Point[]): [Point, Point][] {
  const pairs: [Point, Point][] = [];

  for (let i = 0; i < points.length; i++) {
    for (let j = i + 1; j < points.length; j++) {
      pairs.push([points[i], points[j]]);
    }
  }

  return pairs;
}

const getAntennas = (points: string[][]) => {
  const antennas: Record<string, Point[]> = {};

  for (let y = 0; y < points.length; y++) {
    const element = points[y];
    for (let x = 0; x < element.length; x++) {
      const p = points[y][x];
      if (p !== ".") {
        if (antennas[p]) {
          antennas[p].push({ x, y });
        } else {
          antennas[p] = [{ x, y }];
        }
      }
    }
  }

  return antennas;
};

const getAntinodes = (p1: Point, p2: Point) => {
  const x = p1.x - p2.x; //3
  const y = p1.y - p2.y; //1
  const first = { x: p1.x + x, y: p1.y + y };
  const second = { x: p2.x - x, y: p2.y - y };

  return [first, second];
};

const inRange = (p: Point, input: string[][]) => {
  const isXInRange = p.x >= 0 && p.x < input[0].length;
  const isYInRange = p.y >= 0 && p.y < input.length;
  return isXInRange && isYInRange;
};

export const part1 = async () => {
  const text: string[] = await getInputLineByLine("input.txt");
  const points = text.map((line) => Array.from(line));
  const antennas = getAntennas(points);

  const pairs: [Point, Point][] = Object.keys(antennas)
    .map((key) => {
      return getAllPairs(antennas[key]);
    })
    .flat();

  const possible = pairs.reduce((acc, p) => {
    const [f, s] = p;
    return [...acc, ...getAntinodes(f, s)];
  }, [] as Point[]);

  // console.log(possible);

  const final = new Set();
  const result = possible.filter((p) => inRange(p, points));
  result.forEach((r) => {
    final.add(`${r.x},${r.y}`);
  });

  return final.size;
};

const getAntinodes2 = (p1: Point, p2: Point, input: string[][]) => {
  const x = p1.x - p2.x; //3
  const y = p1.y - p2.y; //1

  const final: Point[] = [];
  let pU = { x: p1.x + x, y: p1.y + y };
  let pD = { x: p2.x - x, y: p2.y - y };

  while (inRange(pU, input)) {
    final.push(pU);
    pU = { x: pU.x + x, y: pU.y + y };
  }

  while (inRange(pD, input)) {
    final.push(pD);
    pD = { x: pD.x - x, y: pD.y - y };
  }

  return final;
};

export const part2 = async () => {
  const text: string[] = await getInputLineByLine("input.txt");
  const points = text.map((line) => Array.from(line));
  const antennas = getAntennas(points);

  const pairs: [Point, Point][] = Object.keys(antennas)
    .map((key) => {
      return getAllPairs(antennas[key]);
    })
    .flat();

  const possible = pairs.reduce((acc, p) => {
    const [f, s] = p;
    return [...acc, ...getAntinodes2(f, s, points)];
  }, [] as Point[]);

  const allPossible: Point[] = Object.keys(antennas).reduce((acc, k) => {
    if (antennas[k].length >= 2) {
      return [...acc, ...antennas[k]];
    }
    return acc;
  }, possible);

  const final = new Set();
  const result = allPossible.filter((p) => inRange(p, points));
  result.forEach((r) => {
    final.add(`${r.x},${r.y}`);
    if (points[r.y][r.x] === ".") {
      points[r.y][r.x] = "#";
    }
  });
  points.forEach((l) => console.log(l));

  return final.size;
};

// console.log(await part1());
console.log(await part2());
