import { readInput } from "../utils/input";

export const part1 = async () => {
  const input: string = await readInput("input.txt");
  const [colorsOptions, list] = input.split("\n\n");
  const colors = colorsOptions.split(", ");
  const options = list.split("\n").filter((o) => o !== "");

  return options.filter((o, i) => {
    console.log(">", i, options.length);
    return matchDesign(o, colors);
  }).length;
};

const matchDesign = (s: string, colors: string[]) => {
  if (s === "") {
    return true;
  }

  if (s.length === 1) {
    return colors.filter((color) => color === s);
  }

  const answer = colors.some((c) => {
    if (s.startsWith(c)) {
      return matchDesign(s.slice(c.length), colors);
    }

    return false;
  });

  return answer;
};

console.log(await part1());
