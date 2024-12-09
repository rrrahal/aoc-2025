import { getInputLineByLine } from "../utils/input";

type Point = {
  x: number;
  y: number;
  hasObstable?: boolean;
};

type Guard = {
  position: Point;
  direction: string;
};

type Coordinates = Record<string, Point>;

const getCoord = (text: string[]): [Coordinates, Point] => {
  const coord: Coordinates = {};
  const starting: Point = { x: 0, y: 0, hasObstable: false };
  for (let i = 0; i < text.length; i++) {
    for (let j = 0; j < text[0].length; j++) {
      if (text[i][j] === "#") {
        const p: Point = {
          x: j,
          y: i,
          hasObstable: true,
        };
        coord[`${j},${i}`] = p;
      } else if (text[i][j] === ".") {
        const p: Point = {
          x: j,
          y: i,
          hasObstable: false,
        };
        coord[`${j},${i}`] = p;
      } else {
        starting.x = j;
        starting.y = i;
        coord[`${j},${i}`] = starting;
      }
    }
  }
  return [coord, starting];
};

export const part1 = async () => {
  const text: string[] = await getInputLineByLine("input.txt");

  const [coordinates, startingPoint] = getCoord(text);

  const guard: Guard = {
    position: startingPoint,
    direction: "UP",
  };

  const visitedPosition: Set<Point> = new Set();
  visitedPosition.add(startingPoint);

  while (isInBounds(guard.position, text)) {
    const nextPos = getNextPos(guard);
    if (!isInBounds(nextPos, text)) {
      break;
    }
    const graphP = coordinates[`${nextPos.x},${nextPos.y}`];
    if (graphP.hasObstable) {
      const newDirection: string = changeDirection(guard);
      guard.direction = newDirection;
    } else {
      guard.position = graphP;
      visitedPosition.add(graphP);
    }
  }

  return visitedPosition.size;
};

const changeDirection = (guard: Guard) => {
  if (guard.direction === "UP") {
    return "RIGHT";
  }
  if (guard.direction === "RIGHT") {
    return "DOWN";
  }

  if (guard.direction === "DOWN") {
    return "LEFT";
  }

  if (guard.direction === "LEFT") {
    return "UP";
  }

  return guard.direction;
};

const getNextPos = (guard: Guard): Point => {
  switch (guard.direction) {
    case "UP": {
      return {
        y: guard.position.y - 1,
        x: guard.position.x,
      };
    }
    case "DOWN": {
      return {
        y: guard.position.y + 1,
        x: guard.position.x,
      };
    }
    case "RIGHT": {
      return {
        y: guard.position.y,
        x: guard.position.x + 1,
      };
    }
    case "LEFT": {
      return {
        y: guard.position.y,
        x: guard.position.x - 1,
      };
    }
    default: {
      return guard.position;
    }
  }
};

const isInBounds = (p: Point, graph: string[]) => {
  const isXInBounds = p.x >= 0 && p.x < graph.length;
  const isYInBounds = p.y >= 0 && p.y < graph[0].length;

  return isXInBounds && isYInBounds;
};

console.log(await part1());