import { readInput } from "../utils/input";

export const part1 = async () => {
  const input: string = await readInput("input.txt");
  const [colorsOptions, list] = input.split("\n\n");
  const colors = colorsOptions.split(", ");
  const options = list.split("\n").filter((o) => o !== "");

  const cache: Map<string, number> = new Map();

  const match = (s: string | undefined) => {
    if (!s) {
      return 1;
    }
    if (cache.has(s)) {
      return cache.get(s)!;
    }
    let res = 0;
    for (const color of colors) {
      if (s.startsWith(color)) {
        res += match(s.substring(color.length));
      }
    }
    cache.set(s, res);
    return res;
  };

  return options.reduce((acc, o) => {
    if (match(o)) {
      return acc + 1;
    }

    return acc;
  }, 0);
};

export const part2 = async () => {
  const input: string = await readInput("input.txt");
  const [colorsOptions, list] = input.split("\n\n");
  const colors = colorsOptions.split(", ");
  const options = list.split("\n").filter((o) => o !== "");

  const cache: Map<string, number> = new Map();

  const match = (s: string | undefined) => {
    if (!s) {
      return 1;
    }
    if (cache.has(s)) {
      return cache.get(s)!;
    }
    let res = 0;
    for (const color of colors) {
      if (s.startsWith(color)) {
        res += match(s.substring(color.length));
      }
    }
    cache.set(s, res);
    return res;
  };

  return options.reduce((acc, o) => {
    const v = match(o);
    if (match(o)) {
      return acc + v;
    }

    return acc;
  }, 0);
};

// console.log(await part1());
console.log(await part2());
