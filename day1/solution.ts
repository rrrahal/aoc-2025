import { getInputLineByLine, readInput } from "../utils/input";

const part1 = async () => {
  const input = await getInputLineByLine("input.txt");
  const parsedInput = input.map((val: string) => val.split("   "));

  const leftNumbers: number[] = [];
  const rightNumbers: number[] = [];

  parsedInput.forEach((pair: string[]) => {
    const left = Number(pair[0]);
    const right = Number(pair[1]);

    leftNumbers.push(left);
    rightNumbers.push(right);
  });

  const sLeftNumbers = leftNumbers.sort();
  const sRightNumbers = rightNumbers.sort();

  const answer = sLeftNumbers.reduce((acc, val, i) => {
    return acc + Math.abs(sRightNumbers[i] - val);
  }, 0);

  return answer;
};

const part2 = async () => {
  const input = await getInputLineByLine("input.txt");
  const parsedInput = input.map((val: string) => val.split("   "));

  const leftNumbers: number[] = [];
  const rightNumbers: number[] = [];

  parsedInput.forEach((pair: string[]) => {
    const left = Number(pair[0]);
    const right = Number(pair[1]);

    leftNumbers.push(left);
    rightNumbers.push(right);
  });

  const rightMap = {};
  rightNumbers.forEach((n) => {
    if (n in rightMap) {
      rightMap[n] += 1;
    } else {
      rightMap[n] = 1;
    }
  });

  const answer = leftNumbers.reduce((acc, val) => {
    if (val in rightMap) {
      return acc + val * rightMap[val];
    }

    return acc;
  }, 0);

  return answer;
};

console.log(await part1());
console.log(await part2());
