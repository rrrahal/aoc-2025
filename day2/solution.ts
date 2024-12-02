import { getInputLineByLine } from "../utils/input";

export const part1 = async () => {
  const text = await getInputLineByLine("input.txt");

  const levels = text.map((line) => line.split(" "));

  return levels.reduce((acc, level) => {
    if (isSafe(level)) {
      return acc + 1;
    }
    return acc;
  }, 0);
};

const isSafe = (level: string[]): boolean => {
  let order: "asc" | "desc" | null = null;
  for (let index = 0; index < level.length - 1; index++) {
    const element = parseInt(level[index]);
    const next = parseInt(level[index + 1]);
    if (Math.abs(element - next) > 3) return false;
    if (element === next) return false;

    if (order === null) {
      if (element > next) {
        order = "desc";
      } else {
        order = "asc";
      }
    } else {
      if (order === "asc" && element > next) {
        return false;
      }

      if (order === "desc" && element < next) return false;
    }
  }

  return true;
};

const removeItem = (array, index) => {
  const coppied = [...array];
  const removed = coppied.splice(index, 1);

  return coppied;
};

export const part2 = async () => {
  const text = await getInputLineByLine("input.txt");

  const levels = text.map((line) => line.split(" "));

  return levels.reduce((acc, level) => {
    if (isSafe(level)) {
      return acc + 1;
    }
    const anySafe = level.some((_, index) => isSafe(removeItem(level, index)));

    if (anySafe) {
      return acc + 1;
    }

    return acc;
  }, 0);
};

console.log(await part1());
console.log(await part2());
