import { getInputLineByLine } from "../utils/input";

type Pos = {
  i: number;
  j: number;
};

enum Direction {
  UP,
  LEFT,
  RIGHT,
  DOWN,
  ANY,
}

type Score = {
  value: number;
  dir: Direction;
};

type Neighboor = {
  coord: [number, number];
  dir: Direction;
};

export const part1 = async () => {
  const text: string[] = await getInputLineByLine("input.txt");
  const dp: Score[][] = [];
  let startingPos: Pos = { i: 0, j: 0 };
  let endPos: Pos = { i: 0, j: 0 };

  for (let i = 0; i < text.length; i++) {
    dp.push([] as Score[]);
    for (let j = 0; j < text[0].length; j++) {
      if (text[i][j] === "S") {
        dp[i].push({ value: 0, dir: Direction.RIGHT });
        startingPos.i = i;
        startingPos.j = j;
      } else {
        dp[i].push(infScore());
      }

      if (text[i][j] === "E") {
        endPos.i = i;
        endPos.j = j;
      }
    }
  }

  fillScores(startingPos, dp, text);
  printDp(dp);

  return dp[endPos.i][endPos.j];
};

const fillScores = (starting: Pos, dp: Score[][], grid: string[]) => {
  const startingPos = {
    coord: [starting.i, starting.j],
    dir: Direction.RIGHT,
  };

  const visited = new Set<string>();
  const queue = [startingPos] as Neighboor[];

  while (queue.length > 0) {
    const currentNode = queue.shift();
    if (!currentNode) {
      return dp;
    }
    const currentCoord = currentNode.coord;
    const currentScore = dp[currentCoord[0]][currentCoord[1]];
    const neighbors = getNeighbors(...currentNode.coord, grid).filter(
      (n) =>
        !visited.has(
          `${currentScore.value},${n.coord[0]},${n.coord[1]},${n.dir}`,
        ),
    );

    neighbors.forEach((n) => {
      const nCoord = n.coord;
      const neighboorScore = dp[nCoord[0]][nCoord[1]];
      if (neighboorScore.value !== Infinity) {
        visited.add(
          `${currentScore.value},${n.coord[0]},${n.coord[1]},${n.dir}`,
        );
      }

      if (currentScore.dir === n.dir) {
        if (neighboorScore.value > currentScore.value + 1) {
          neighboorScore.value = currentScore.value + 1;
          neighboorScore.dir = n.dir;
        }
      } else if (isOposite(currentScore.dir, n.dir)) {
        if (neighboorScore.value > currentScore.value + 1 + 2000) {
          neighboorScore.value = currentScore.value + 1 + 2000;
          neighboorScore.dir = n.dir;
        }
      } else {
        if (neighboorScore.value > currentScore.value + 1 + 1000) {
          neighboorScore.value = currentScore.value + 1 + 1000;
          neighboorScore.dir = n.dir;
        }
      }
    });
    queue.push(...neighbors);
  }
};

const printDp = (dp) => {
  dp.forEach((row) => {
    console.log(
      row
        .map((r) => {
          if (r.value === Infinity) {
            return "  + ";
          }
          if (r.value < 1000) {
            return `000${r.value}`;
          }
          return r.value;
        })
        .join(" "),
    );
  });
  console.log("\n");
};

const isOposite = (dir1: Direction, dir2: Direction) => {
  const a = dir1 === Direction.UP && dir2 === Direction.DOWN;
  const b = dir1 === Direction.DOWN && dir2 === Direction.UP;
  const c = dir1 === Direction.RIGHT && dir2 === Direction.LEFT;
  const d = dir1 === Direction.LEFT && dir2 === Direction.RIGHT;

  return a || b || c || d;
};

const getNeighbors = (i: number, j: number, grid: string[]): Neighboor[] => {
  const top = [i - 1, j];
  const bottom = [i + 1, j];
  const right = [i, j + 1];
  const left = [i, j - 1];

  return [top, bottom, left, right].reduce((acc, nei, index) => {
    try {
      const element = grid[nei[0]][nei[1]];

      if (element === "#") {
        return acc;
      }

      if (index === 0) {
        return [...acc, { coord: nei, dir: Direction.UP }];
      }
      if (index === 1) {
        return [...acc, { coord: nei, dir: Direction.DOWN }];
      }
      if (index === 2) {
        return [...acc, { coord: nei, dir: Direction.LEFT }];
      }
      if (index === 3) {
        return [...acc, { coord: nei, dir: Direction.RIGHT }];
      }

      return acc;
    } catch (e) {
      return acc;
    }
  }, [] as Neighboor[]);
};

const infScore = () => ({
  value: Infinity,
  dir: Direction.ANY,
});

const part2 = async () => {
  const text: string[] = await getInputLineByLine("input.txt");
  const dp: Score[][] = [];
  let startingPos: Pos = { i: 0, j: 0 };
  let endPos: Pos = { i: 0, j: 0 };

  for (let i = 0; i < text.length; i++) {
    dp.push([] as Score[]);
    for (let j = 0; j < text[0].length; j++) {
      if (text[i][j] === "S") {
        dp[i].push({ value: 0, dir: Direction.RIGHT });
        startingPos.i = i;
        startingPos.j = j;
      } else {
        dp[i].push(infScore());
      }

      if (text[i][j] === "E") {
        endPos.i = i;
        endPos.j = j;
      }
    }
  }

  fillScores(startingPos, dp, text);
  const maxValue = dp[endPos.i][endPos.j].value;
  // given a max value,
  // I now can get all the possible paths that are equal to the this value
  const ways = getAllWays(startingPos, endPos, maxValue, text, dp);
  const unique: Set<string> = new Set();
  ways.forEach((w) => {
    w.forEach((v) => {
      unique.add(JSON.stringify(v));
    });
  });
  console.log(unique.size);
  // console.log(ways);
};

const getAllWays = (
  start: Pos,
  end: Pos,
  maxValue: number,
  grid: string[],
  dp: Score[][], // max possible scores for each position, dir
) => {
  let initialDirection = Direction.RIGHT;
  const seen: Set<string> = new Set();
  const q: [[Pos, Direction], number, Pos[]][] = [
    [[start, initialDirection], 0, []],
  ];

  const ways: Pos[][] = [];
  while (q.length) {
    const [[node, dir], value, way] = q.shift()!;
    console.log(q.length);
    // found a good way
    if (node.i === end.i && node.j === end.j && value === maxValue) {
      ways.push([...way, node]);
      continue;
    }

    // I reached a bad path
    if (value >= maxValue) {
      continue;
    }

    if (value > dp[node.i][node.j].value && dir === dp[node.i][node.j].dir) {
      continue;
    }

    const neighbors = getNeighbors(node.i, node.j, grid).filter((n) => {
      const key = JSON.stringify([n.coord, n.dir, way]);
      return !seen.has(key);
    });

    neighbors.forEach((n) => {
      const key = JSON.stringify([n.coord, n.dir, way]);
      seen.add(key);

      const newValue =
        value + (n.dir === dir ? 1 : isOposite(n.dir, dir) ? 2001 : 1001);
      q.push([
        [{ i: n.coord[0], j: n.coord[1] }, n.dir],
        newValue,
        [...way, node],
      ]);
    });
  }

  return ways;
};

// console.log(await part1());
console.log(await part2());
