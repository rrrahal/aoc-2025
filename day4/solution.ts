import { getInputLineByLine } from "../utils/input";

type Coordinate = {
  x: number;
  y: number;
};

const getStartingPoints = (graph: string[][], letter: string) => {
  const startingPoints: Coordinate[] = [];

  for (let i = 0; i < graph.length; i++) {
    for (let j = 0; j < graph[0].length; j++) {
      if (graph[i][j] === letter) {
        startingPoints.push({ x: i, y: j });
      }
    }
  }
  return startingPoints;
};

const getAllPossibleWords = (point: Coordinate) => {
  const bla = [1, 2, 3];
  const right = bla.map((p) => ({ x: point.x + p, y: point.y }));
  const diagRightUp = bla.map((p) => ({ x: point.x + p, y: point.y + p }));
  const up = bla.map((p) => ({ x: point.x, y: point.y + p }));
  const diagLeftUp = bla.map((p) => ({ x: point.x - p, y: point.y + p }));
  const left = bla.map((p) => ({ x: point.x - p, y: point.y }));
  const diagLeftDown = bla.map((p) => ({ x: point.x - p, y: point.y - p }));
  const down = bla.map((p) => ({ x: point.x, y: point.y - p }));
  const diagRightDown = bla.map((p) => ({ x: point.x + p, y: point.y - p }));

  return [
    right,
    diagRightUp,
    up,
    diagLeftUp,
    left,
    diagLeftDown,
    down,
    diagRightDown,
  ];
};

const search = (startingPoint: Coordinate, graph: string[][]): number => {
  const word = ["M", "A", "S"];
  const possibilities = getAllPossibleWords(startingPoint);

  return possibilities.reduce((acc, pos) => {
    try {
      const result = pos.every((p, index) => graph[p.x][p.y] === word[index]);
      if (result) {
        return acc + 1;
      }
      return acc;
    } catch (e) {
      return acc;
    }
  }, 0);
};

export const part1 = async () => {
  const text: string[] = await getInputLineByLine("input.txt");

  const graph = text.map((line) => Array.from(line));
  const startingPoints = getStartingPoints(graph, "X");
  const words = startingPoints.reduce((acc, point) => {
    return acc + search(point, graph);
  }, 0);

  console.log(words);
};

const getMasPosibilities = (startingPoint: Coordinate) => {
  const leftDiag = [
    { x: startingPoint.x - 1, y: startingPoint.y + 1 },
    { x: startingPoint.x + 1, y: startingPoint.y - 1 },
  ];

  const rightDiag = [
    { x: startingPoint.x + 1, y: startingPoint.y + 1 },
    { x: startingPoint.x - 1, y: startingPoint.y - 1 },
  ];

  return [leftDiag, rightDiag];
};

const hasMAS = (points: Coordinate[], graph: string[][]): boolean => {
  const first = points[0];
  const second = points[1];

  return (
    (getPoint(first, graph) === "M" && getPoint(second, graph) === "S") ||
    (getPoint(first, graph) === "S" && getPoint(second, graph) === "M")
  );
};

const search_part2 = (startingPoint: Coordinate, graph: string[][]): number => {
  const [leftDiag, rightDiag] = getMasPosibilities(startingPoint);

  if (hasMAS(leftDiag, graph) && hasMAS(rightDiag, graph)) {
    return 1;
  }

  return 0;
};

const getPoint = (point: Coordinate, graph: string[][]) => {
  try {
    return graph[point.x][point.y];
  } catch (e) {
    return null;
  }
};

export const part2 = async () => {
  const text: string[] = await getInputLineByLine("input.txt");

  const graph = text.map((line) => Array.from(line));
  const startingPoints = getStartingPoints(graph, "A");
  const words = startingPoints.reduce((acc, point) => {
    return acc + search_part2(point, graph);
  }, 0);

  return words;
};

console.log(await part1());
console.log(await part2());
