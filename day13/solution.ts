import { readInput } from "../utils/input";

type Coordinate = {
  x: number;
  y: number;
};

type Machine = {
  goal: Coordinate;
  a: Coordinate;
  b: Coordinate;
};

export const part1 = async () => {
  const text: string = await readInput("input.txt");
  const machines = text.split("\n\n");
  const parsedMachines: Machine[] = machines.map((m) => {
    const inputs = m.split("\n");
    const a = inputs[0]
      .split(": ")[1]
      .split(", ")
      .map((el) => el.split("+")[1])
      .map((n) => parseInt(n));
    const b = inputs[1]
      .split(": ")[1]
      .split(", ")
      .map((el) => el.split("+")[1])
      .map((n) => parseInt(n));

    const prize = inputs[2]
      .split(": ")[1]
      .split(", ")
      .map((el) => el.split("=")[1])
      .map((n) => parseInt(n));

    return {
      goal: { x: prize[0], y: prize[1] },
      a: { x: a[0], y: a[1] },
      b: { x: b[0], y: b[1] },
    };
  });

  const results = parsedMachines
    .map((m) => solveMachine2(m))
    .filter((r) => r.length !== 0);

  return results.reduce((acc, v) => {
    return acc + v[0] * 3 + v[1];
  }, 0);
};

const bruteForce = (machine: Machine) => {
  const results: number[][] = [];
  for (let i = 0; i < 100; i++) {
    for (let j = 0; j < 100; j++) {
      const x = machine.a.x * i + machine.b.x * j;
      const y = machine.a.y * i + machine.b.y * j;
      if (x === machine.goal.x && y === machine.goal.y) {
        results.push([i, j]);
      }
      const x2 = machine.a.x * j + machine.b.x * i;
      const y2 = machine.a.y * j + machine.b.y * i;
      if (x2 === machine.goal.x && y2 === machine.goal.y) {
        results.push([j, i]);
      }
    }
  }

  return results;
};

export const part2 = async () => {
  const text: string = await readInput("input.txt");
  const machines = text.split("\n\n");
  const parsedMachines: Machine[] = machines.map((m) => {
    const inputs = m.split("\n");
    const a = inputs[0]
      .split(": ")[1]
      .split(", ")
      .map((el) => el.split("+")[1])
      .map((n) => parseInt(n));
    const b = inputs[1]
      .split(": ")[1]
      .split(", ")
      .map((el) => el.split("+")[1])
      .map((n) => parseInt(n));

    const prize = inputs[2]
      .split(": ")[1]
      .split(", ")
      .map((el) => el.split("=")[1])
      .map((n) => parseInt(n));

    return {
      goal: { x: prize[0] + 10000000000000, y: prize[1] + 10000000000000 },
      a: { x: a[0], y: a[1] },
      b: { x: b[0], y: b[1] },
    };
  });

  const results = parsedMachines
    .map((m) => solveMachine2(m))
    .filter((r) => r.length !== 0);

  return results.reduce((acc, v) => {
    return acc + v[0] * 3 + v[1];
  }, 0);
};

const solveMachine2 = (machine: Machine) => {
  const problemMatrix = [
    [machine.a.x, machine.b.x],
    [machine.a.y, machine.b.y],
  ];
  const xMatrix = [
    [machine.goal.x, machine.b.x],
    [machine.goal.y, machine.b.y],
  ];
  const yMatrix = [
    [machine.a.x, machine.goal.x],
    [machine.a.y, machine.goal.y],
  ];

  const x = det(xMatrix) / det(problemMatrix);
  const y = det(yMatrix) / det(problemMatrix);

  if (Number.isInteger(x) && Number.isInteger(y)) {
    return [x, y];
  }

  return [];
};

const det = (matrix: number[][]) => {
  return matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0];
};
console.log(await part1());
console.log(await part2());
