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
  const text: string[] = await getInputLineByLine("example.txt");
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

  return dp[endPos.i][endPos.j];
};

const fillScores = (starting: Pos, dp: Score[][], grid: string[]) => {
  const startingPos = {
    coord: [starting.i, starting.j],
    dir: Direction.RIGHT,
  };

  const visited = new Set<string>();
  const queue = [startingPos] as Neighboor[];
  let i = 0;

  while (queue.length > 0) {
    i++;
    const currentNode = queue.shift();
    if (!currentNode) {
      return dp;
    }
    const currentCoord = currentNode.coord;
    const neighbors = getNeighbors(...currentNode.coord, grid).filter(
      (n) => !visited.has(`${n.coord[0]},${n.coord[1]},${n.dir}`),
    );

    visited.add(`${currentCoord[0]},${currentCoord[1]},${currentNode.dir}`);

    neighbors.forEach((n) => {
      const nCoord = n.coord;

      let currentDp = { ...dp[currentCoord[0]][currentCoord[1]] };
      const newDp = dp[nCoord[0]][nCoord[1]];
      if (visited.has(`${nCoord[0]},${nCoord[1]},${n.dir}`)) {
        return;
      }
      visited.add(`${nCoord[0]},${nCoord[1]},${n.dir}`);

      if (currentDp.dir !== currentNode.dir) {
        if (isOposite(currentDp.dir, currentNode.dir)) {
          currentDp.value += 2000;
        } else {
          currentDp.value += 1000;
        }
      }

      const newValue = currentDp.value + 1;
      if (newValue < newDp.value) {
        newDp.value = newValue;
        newDp.dir = currentNode.dir;
      }
    });
    if (i < 30) {
      printDp(dp);
    }
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

console.log(await part1());
