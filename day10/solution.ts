import { getInputLineByLine } from "../utils/input";

type Point = {
  i: number;
  j: number;
};

const getStartPositions = (input: number[][]) => {
  const points: Point[] = [];
  for (let i = 0; i < input.length; i++) {
    for (let j = 0; j < input[0].length; j++) {
      if (input[i][j] === 0) {
        points.push({ i, j });
      }
    }
  }
  return points;
};

export const part1 = async () => {
  const text: string[] = await getInputLineByLine("input.txt");
  const input = text.map((l) =>
    Array.from(l).map((x) => {
      if (x === ".") {
        return Infinity;
      }
      return parseInt(x);
    }),
  );
  const startingPoints = getStartPositions(input);

  let result = 0;

  startingPoints.forEach((p) => {
    const unique = new Set();
    const trails = search(p, 0, input);
    trails.forEach((t) => unique.add(`${t.i},${t.j}`));
    result += unique.size;
  });

  return result;
};

export const part2 = async () => {
  const text: string[] = await getInputLineByLine("input.txt");
  const input = text.map((l) =>
    Array.from(l).map((x) => {
      if (x === ".") {
        return Infinity;
      }
      return parseInt(x);
    }),
  );
  const startingPoints = getStartPositions(input);

  return startingPoints.reduce((acc, p) => {
    return acc + search(p, 0, input).length;
  }, 0);
};

const getValue = (p: Point, input: number[][]) => {
  try {
    return input[p.i][p.j];
  } catch (e) {
    return -1;
  }
};

const possibleValues = (p: Point) => {
  const right = { i: p.i + 1, j: p.j };
  const left = { i: p.i - 1, j: p.j };
  const up = { i: p.i, j: p.j + 1 };
  const down = { i: p.i, j: p.j - 1 };

  return [right, left, up, down];
};

const search = (p: Point, currentValue: number, input: number[][]): Point[] => {
  if (currentValue === 9 && getValue(p, input) === 9) {
    return [p];
  }

  const neighbors = possibleValues(p).map((p) => {
    return {
      point: p,
      value: getValue(p, input),
    };
  });

  return neighbors.reduce((acc, n) => {
    if (n.value > 9) {
      return acc;
    }
    if (n.value === currentValue + 1) {
      return [...acc, ...search(n.point, currentValue + 1, input)];
    }

    return acc;
  }, [] as Point[]);
};

// console.log(await part1());
console.log(await part2());
