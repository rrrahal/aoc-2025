import { getInputLineByLine } from "../utils/input";

export const part1 = async () => {
  const text: string[] = await getInputLineByLine("input.txt");
  const line = text.map((l) => l.split(": "));
  const parsedLines: [number, number[]][] = line.map((l) => {
    const result = parseInt(l[0]);
    const operators = l[1].split(" ").map((n) => parseInt(n));

    return [result, operators];
  });

  let results: number[] = [];
  let debug: number[][] = [];

  parsedLines.forEach((line) => {
    const currentResult = line[0];
    const operators = line[1];
    const possibilities = makeOperations(operators);
    const correct = possibilities[possibilities.length - 1];
    const isPossible = correct.some((v) => v === currentResult);
    if (isPossible) {
      results.push(currentResult);
      debug.push(correct);
    }
  });

  const solution = results.reduce((acc, val) => acc + val, 0);
  return solution;
};

const makeOperations = (operators: number[]) => {
  const steps = [[operators[0]]];
  for (let index = 1; index < operators.length; index++) {
    const partial: number[] = [];
    const element = operators[index];
    steps[index - 1].forEach((v) => {
      partial.push(v + element);
      partial.push(v * element);
    });
    steps.push(partial);
  }

  return steps;
};

const makeOperations2 = (operators: number[]) => {
  const steps = [[operators[0]]];
  for (let index = 1; index < operators.length; index++) {
    const partial: number[] = [];
    const element = operators[index];
    steps[index - 1].forEach((v) => {
      partial.push(v + element);
      partial.push(v * element);
      partial.push(parseInt(`${v.toString()}${element.toString()}`));
    });
    steps.push(partial);
  }

  return steps;
};

export const part2 = async () => {
  const text: string[] = await getInputLineByLine("input.txt");
  const line = text.map((l) => l.split(": "));
  const parsedLines: [number, number[]][] = line.map((l) => {
    const result = parseInt(l[0]);
    const operators = l[1].split(" ").map((n) => parseInt(n));

    return [result, operators];
  });

  let results: number[] = [];
  let debug: number[][] = [];

  parsedLines.forEach((line) => {
    const currentResult = line[0];
    const operators = line[1];
    const possibilities = makeOperations2(operators);
    const correct = possibilities[possibilities.length - 1];
    const isPossible = correct.some((v) => v === currentResult);
    if (isPossible) {
      results.push(currentResult);
      debug.push(correct);
    }
  });

  const solution = results.reduce((acc, val) => acc + val, 0);
  return solution;
};

// console.log(await part1());
console.log(await part2());
