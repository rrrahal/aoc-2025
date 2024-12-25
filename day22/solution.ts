import { getInputLineByLine } from "../utils/input";

export const part1 = async () => {
  const input: string[] = await getInputLineByLine("input.txt");
  const initialNumbers = input.map((n) => parseInt(n));

  const numbers: bigint[] = initialNumbers.map((n) => BigInt(n));
  const results: bigint[] = [];
  numbers.forEach((n) => {
    let result = n;
    for (let i = 0; i < 2000; i++) {
      result = getNextSecret(result);
    }
    results.push(result);
  });

  return Number(results.reduce((acc, v) => acc + v, BigInt(0)));
};

const mix = (secret: bigint, value: bigint) => {
  return secret ^ value;
};

const prune = (secret: bigint) => {
  return secret % BigInt(16777216);
};

const getNextSecret = (secret: bigint) => {
  const step1 = prune(mix(secret, secret * BigInt(64)));
  const floor = BigInt(Math.floor(Number(step1) / 32));
  const step2 = prune(mix(step1, floor));
  const step3 = prune(mix(step2, step2 * BigInt(2048)));
  return step3;
};
export const part2 = async () => {
  const input: string[] = await getInputLineByLine("input.txt");
  const initialNumbers = input.map((n) => parseInt(n));

  const numbers: bigint[] = initialNumbers.map((n) => BigInt(n));
  const results: bigint[] = [];
  numbers.forEach((n) => {
    let result = n;
    for (let i = 0; i < 2000; i++) {
      result = getNextSecret(result);
    }
    results.push(result);
  });

  return Number(results.reduce((acc, v) => acc + v, BigInt(0)));
};

// console.log(await part1());
console.log(await part2());
