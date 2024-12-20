import { readInput } from "../utils/input";

type Node = {
  value: string;
  child: Node | null;
  stop: boolean;
  size: number;
};

export const part1 = async () => {
  const input: string = await readInput("input.txt");
  const [colorsOptions, list] = input.split("\n\n");
  const colors = colorsOptions.split(", ");
  const options = list.split("\n").filter((o) => o !== "");

  return options.filter((o) => matchDesign(o, colors)).length;
};

const matchDesign = (s: string, colors: string[]) => {
  if (s === "") {
    return true;
  }

  return colors.some((c) => {
    if (s.startsWith(c)) {
      return matchDesign(s.slice(c.length), colors);
    }

    return false;
  });
};

console.log(await part1());
