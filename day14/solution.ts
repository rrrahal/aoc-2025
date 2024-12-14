import { getInputLineByLine } from "../utils/input";
import { appendFile } from "node:fs/promises";

type Point = {
  x: number;
  y: number;
};

type Velocity = {
  x: number;
  y: number;
};

type Robot = {
  p: Point;
  v: Velocity;
};

export const part1 = async () => {
  const text: string[] = await getInputLineByLine("input.txt");
  const robots = parseRobots(text);

  const finalPos = robots.map((r) => simulateRobot(r, 101, 103));
  console.log(finalPos);
  console.log(getFactor(finalPos, 101, 103));
};

const getFactor = (pos: number[][], maxX: number, maxY: number) => {
  const topLeft = pos.filter((result) => {
    const x = result[0] >= 0 && result[0] < Math.floor(maxX / 2);
    const y = result[1] >= 0 && result[1] < Math.floor(maxY / 2);
    return x && y;
  });
  const topRight = pos.filter((result) => {
    const x = result[0] >= maxX / 2 && result[0] < maxX;
    const y = result[1] >= 0 && result[1] < Math.floor(maxY / 2);
    return x && y;
  });
  const bottomLeft = pos.filter((result) => {
    const x = result[0] >= 0 && result[0] < Math.floor(maxX / 2);
    const y = result[1] >= maxY / 2 && result[1] < maxY;

    return x && y;
  });
  const bottomRight = pos.filter((result) => {
    const x = result[0] >= maxX / 2 && result[0] < maxX;
    const y = result[1] >= maxY / 2 && result[1] < maxY;

    return x && y;
  });

  console.log("topLeft", topLeft);

  return (
    topLeft.length * topRight.length * bottomLeft.length * bottomRight.length
  );
};

const simulateRobot = (robot: Robot, maxX: number, maxY: number) => {
  const finalX = robot.p.x + 100 * robot.v.x;
  const finalY = robot.p.y + 100 * robot.v.y;

  let currentX = robot.p.x;
  let currentY = robot.p.y;
  for (let i = 0; i < 100; i++) {
    currentX += robot.v.x;
    currentY += robot.v.y;
    if (currentX >= maxX) {
      currentX = Math.abs(currentX) % maxX;
    }
    if (currentY >= maxY) {
      currentY = Math.abs(currentY) % maxY;
    }
    if (currentX < 0) {
      currentX += maxX;
    }
    if (currentY < 0) {
      currentY += maxY;
    }
  }

  // const x = Math.abs(finalX) % maxX;
  // const y = Math.abs(finalY) % maxY;

  return [currentX, currentY];
};

const parseRobots = (input: string[]): Robot[] => {
  return input.map((l) => {
    const s = l.split(" ");
    const p = s[0]
      .split("=")[1]
      .split(",")
      .map((n) => parseInt(n));
    const v = s[1]
      .split("=")[1]
      .split(",")
      .map((n) => parseInt(n));

    return {
      p: { x: p[0], y: p[1] },
      v: { x: v[0], y: v[1] },
    };
  });
};

const step = (robots: Robot[], maxX: number, maxY: number) => {
  robots.forEach((robot) => {
    let currentX = robot.p.x + robot.v.x;
    let currentY = robot.p.y + robot.v.y;
    if (currentX >= maxX) {
      currentX = Math.abs(currentX) % maxX;
    }
    if (currentY >= maxY) {
      currentY = Math.abs(currentY) % maxY;
    }
    if (currentX < 0) {
      currentX += maxX;
    }
    if (currentY < 0) {
      currentY += maxY;
    }
    robot.p.x = currentX;
    robot.p.y = currentY;
  });
};

const currentField = (robots: Robot[], maxX: number, maxY: number) => {
  let field: string[][] = [];
  for (let i = 0; i < maxY; i++) {
    field.push([]);
    for (let j = 0; j < maxX; j++) {
      field[i].push(".");
    }
  }

  robots.forEach((r) => {
    field[r.p.y][r.p.x] = "1";
  });
  return field;
};

const part2 = async () => {
  const text: string[] = await getInputLineByLine("input.txt");
  const robots = parseRobots(text);

  for (let i = 0; i < 10000; i++) {
    step(robots, 101, 103);
    const field = currentField(robots, 101, 103);
    if (hasSequences(field)) {
      console.log(i);
      printExample(field);
    }
  }
};

const printExample = (field: string[][]) => {
  field.forEach((f) => {
    console.log(f.join(""));
  });
};

const hasSequences = (field: string[][]) => {
  let seq = 0;
  for (let i = 0; i < field.length; i++) {
    let found = false;
    for (let j = 2; j < field[0].length - 2; j++) {
      if (field[i][j] === "1") {
        const a = field[i][j - 2];
        const b = field[i][j - 1];
        const c = field[i][j];
        const d = field[i][j + 1];
        if ([a, b, c, d].every((el) => el === "1")) {
          found = true;
        }
      }
    }
    if (found) {
      seq++;
    }
  }

  return seq > 6;
};

// console.log(await part1());
console.log(await part2());
