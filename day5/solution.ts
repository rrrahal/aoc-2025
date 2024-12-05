import { readInput } from "../utils/input";

type Node = {
  children: Node[];
  value: number;
};

type RefTable = Record<number, Node>;

export const part1 = async () => {
  const text: string = await readInput("input.txt");
  const parts = text.split("\n\n");
  const rules = parts[0].split("\n");
  const updates: number[][] = parts[1]
    .split("\n")
    .filter((line) => line != "")
    .map((line) => line.split(","))
    .map((line) => line.map((val) => parseInt(val)));

  const deps = rules.map((rule) => rule.split("|").map((n) => parseInt(n)));
  const graph = createDepGraph(deps);

  const goodArrays = updates.reduce((acc, update) => {
    const isGood = update.every((value, index) =>
      dfs(graph[value], update.slice(0, index), update),
    );

    if (isGood) {
      return [...acc, update];
    }
    return acc;
  }, [] as number[][]);

  const answer = goodArrays.reduce((acc, arr) => {
    const len = Math.floor(arr.length / 2);

    return acc + arr[len];
  }, 0);

  console.log(answer);
};

const createDepGraph = (deps: number[][]) => {
  const graph: RefTable = {};

  deps.forEach((dep) => {
    const [x, y] = dep;
    if (!graph[y]) {
      const n: Node = {
        children: [],
        value: y,
      };

      if (graph[x]) {
        n.children.push(graph[x]);
      } else {
        const xNode: Node = {
          children: [],
          value: x,
        };
        n.children.push(xNode);
        graph[x] = xNode;
      }
      graph[y] = n;
    } else {
      if (graph[x]) {
        graph[y].children.push(graph[x]);
      } else {
        const xNode: Node = {
          children: [],
          value: x,
        };
        graph[y].children.push(xNode);
        graph[x] = xNode;
      }
    }
  });

  return graph;
};

const dfs = (root: Node, seenNumbers: number[], update: number[]) => {
  if (root.children.length === 0) {
    return true;
  }

  const validChildren = root.children.filter((child) =>
    update.includes(child.value),
  );

  return validChildren.every((child) => {
    const seen = seenNumbers.includes(child.value);
    return seen && dfs(child, seenNumbers, update);
  });
};

const fixArray = (badArray: number[], graph: RefTable) => {
  return badArray.reduce((acc, value, index) => {
    const currentNode = graph[value];
    const validChildren = currentNode.children.filter((child) =>
      acc.includes(child.value),
    );
    let newAcc = [...acc];

    validChildren.forEach((child) => {
      const isWrong = acc.slice(index).includes(child.value);
      if (isWrong) {
        newAcc = newAcc.filter((val) => val !== child.value);
        if (index === 0) {
          newAcc.splice(0, 0, child.value);
        } else {
          newAcc.splice(index, 0, child.value);
        }
      }
    });

    return newAcc;
  }, badArray);
};

const fixArraysOuter = (badArrays: number[][], graph: RefTable) => {
  const fixedArray: number[][] = [];
  while (badArrays.length > 0) {
    badArrays.forEach((arr, index) => {
      const fixed = fixArray(arr, graph);
      const isGood = fixed.every((value, index) =>
        dfs(graph[value], fixed.slice(0, index), fixed),
      );

      if (isGood) {
        badArrays.splice(index, 1);
        fixedArray.push(fixed);
      }
    });
  }

  return fixedArray;
};

const part2 = async () => {
  const text: string = await readInput("input.txt");
  const parts = text.split("\n\n");
  const rules = parts[0].split("\n");
  const updates: number[][] = parts[1]
    .split("\n")
    .filter((line) => line != "")
    .map((line) => line.split(","))
    .map((line) => line.map((val) => parseInt(val)));

  const deps = rules.map((rule) => rule.split("|").map((n) => parseInt(n)));
  const graph = createDepGraph(deps);

  const badArrays = updates.reduce((acc, update) => {
    const isGood = update.every((value, index) =>
      dfs(graph[value], update.slice(0, index), update),
    );

    if (isGood) {
      return acc;
    }
    return [...acc, update];
  }, [] as number[][]);

  const fixed = fixArraysOuter(badArrays, graph);
  console.log(badArrays, fixed);

  const answer = fixed.reduce((acc, arr) => {
    const len = Math.floor(arr.length / 2);

    return acc + arr[len];
  }, 0);

  console.log(answer);
};

// console.log(await part1());
console.log(await part2());
