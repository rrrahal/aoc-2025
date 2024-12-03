import { getInputLineByLine, readInput } from "../utils/input";

export const part1 = async () => {
  const text: string = await readInput("input.txt");
  const regex = /mul\(\d+,\d+\)/g;

  const result = text.match(regex);
  return result?.reduce((acc, op) => {
    const numbers = op.match(/\d+/g);
    return (
      acc +
      numbers?.reduce((acc, n) => {
        return acc * parseInt(n);
      }, 1)
    );
  }, 0);
};

export const part2 = async () => {
  const text: string = await readInput("input.txt");
  const regex = /(mul\(\d+,\d+\)|(do\(\))|(don\'t\(\)))/g;

  const matches = text.match(regex);
  const ops = matches.reduce((acc, op) => {
    if (op.startsWith("mul")) {
      const numbers = op.match(/\d+/g);
      return [...acc, numbers?.reduce((acc, n) => acc * parseInt(n), 1)];
    }

    if (op.startsWith("do()")) {
      return [...acc, true];
    }

    return [...acc, false];
  }, []);

  let state = true;
  let result = 0;
  ops.forEach((element) => {
    if (typeof element === "boolean") {
      state = element;
    }
    if (typeof element === "number" && state) {
      result += element;
    }
  });
  return result;
};

console.log(await part1());
console.log(await part2());
