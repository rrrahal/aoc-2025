import { readInput } from "../utils/input";

export const part1 = async () => {
  const input: string = await readInput("input.txt");
  const grids = input.split("\n\n");

  const [locks, keys] = grids.reduce(
    (acc, grid) => {
      const parsed = grid.split("\n");
      if (parsed[0][0] === "#") {
        acc[0].push(parsed);
      } else {
        acc[1].push(parsed);
      }
      return acc;
    },
    [[], []] as [string[][], string[][]],
  );

  const lockHeights = locks.map((l) => getLockHeights(l));
  const keyHeights = keys.map((k) => getKeyHeights(k));

  return getUniquePairs(keyHeights, lockHeights);
};

const getLockHeights = (lock: string[]) => {
  const results: number[] = [];
  for (let j = 0; j < lock[0].length; j++) {
    let height = 0;
    for (let i = 0; i < lock.length; i++) {
      if (lock[i][j] === "#") {
        height += 1;
      }
    }
    results.push(height - 1);
  }

  return results;
};

const getKeyHeights = (key: string[]) => {
  const results: number[] = [];
  for (let j = 0; j < key[0].length; j++) {
    let height = 0;
    for (let i = key.length - 1; i > 0; i--) {
      if (key[i][j] === "#") {
        height += 1;
      }
    }
    results.push(height - 1);
  }

  return results;
};

const getUniquePairs = (keys: number[][], locks: number[][]) => {
  let result = 0;

  locks.forEach((lock) => {
    keys.forEach((key) => {
      let found = true;
      for (let i = 0; i < lock.length; i++) {
        if (key[i] + lock[i] > 5) {
          found = false;
        }
      }
      if (found) {
        result += 1;
      }
      console.log("testing", lock, key, found);
    });
  });

  return result;
};

console.log(await part1());
