import { getInputLineByLine } from "../utils/input";

export const part1 = async () => {
  const text: string[] = await getInputLineByLine("input.txt");
  const input = text[0].split(" ").map((item) => parseInt(item));

  const finalResult = blink(input, 25);
  return finalResult.length;
};
export const part2 = async () => {
  const text: string[] = await getInputLineByLine("input.txt");
  const input = text[0].split(" ").map((item) => parseInt(item));

  const finalResult = blink(input, 75);
  console.log(finalResult);
  return finalResult.length;
};

const blink = (input: number[], times: number): number[] => {
  let cache: Record<string, number[]> = {};
  return input.reduce((acc, number) => {
    const [result, c] = simulate(number, times, cache);
    cache = c;
    return [...acc, ...result];
  }, [] as number[]);
};

const simulate = (
  n: number,
  times: number,
  cache: Record<string, number[]>,
): [number[], Record<string, number[]>] => {
  const result = [n];

  for (let i = 0; i < times; i++) {
    for (let index = 0; index < result.length; index++) {
      const item = result[index];
      if (item === 0) {
        result[index] = 1;
      } else if (item.toString().length % 2 === 0) {
        const s = item.toString();
        const l = s.length;
        const middle = l / 2;
        const firstPart = s.slice(0, middle);
        const secondPart = s.slice(middle, l);
        result[index] = parseInt(firstPart);
        try {
          result.splice(index + 1, 0, parseInt(secondPart));
        } catch (e) {
          result.push(parseInt(secondPart));
        } finally {
          index++;
        }
      } else {
        result[index] = item * 2024;
      }
    }
  }

  return [result, cache];
};

console.log(await part1());
console.log(await part2());
