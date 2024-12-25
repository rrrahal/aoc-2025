import { readInput } from "../utils/input";

export const part1 = async () => {
  const input: string = await readInput("input.txt");
  const [colorsOptions, list] = input.split("\n\n");
  const colors = colorsOptions.split(", ");
  const options = list.split("\n").filter((o) => o !== "");
  return options.filter((o) => match(o, colors) > 0).length;
};

const cache = {};
const match = (s: string, colors: string[]) => {
  console.log(s);
  if (!cache[s]) {
    if (s.length === 0) {
      return 1;
    }
    let result = 0;
    for (let j = 0; j < colors.length; j++) {
      if (s.startsWith(colors[j])) {
        result += match(s.slice(colors[j].length), colors);
      }
    }
    cache[s] = result;
  }
  return cache[s];
};

console.log(await part1());
