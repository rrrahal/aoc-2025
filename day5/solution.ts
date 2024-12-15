import { readInput } from "../utils/input";

type Node = {
  children: Node[];
  value: number;
};

type SimpleNode = {
  children: number[];
  value: number;
};

type Deps = Record<number, SimpleNode>;
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

const makeDepGraph = (rules: number[][]) => {
  const deps: Deps = {};

  rules.forEach((rule) => {
    const after = rule[1];
    const before = rule[0];

    if (deps[after]) {
      deps[after].children.push(before);
    } else {
      deps[after] = {
        children: [before],
        value: after,
      };
    }

    if (!deps[before]) {
      deps[before] = {
        children: [],
        value: before,
      };
    }
  });

  return deps;
};

const isWrong = (array: number[], depGraph: Deps) => {
  const inArray = new Set(array);
  const seen = new Set();

  return array.some((el) => {
    const deps = depGraph[el].children.filter((c) => inArray.has(c));
    const cond = deps.some((d) => !seen.has(d));
    if (cond) {
      return true;
    }
    seen.add(el);
    return false;
  });
};

const sort = (array: number[], depGraph: Deps) => {
  const seen = new Set();
  const inArray = new Set(array);

  const sortedArray: number[] = [];

  const toBeAdded: SimpleNode[] = array.map((el) => {
    const relevantDeps = depGraph[el].children.filter((d) => inArray.has(d));
    return {
      children: relevantDeps,
      value: el,
    };
  });
  while (toBeAdded.length !== sortedArray.length) {
    for (let i = 0; i < toBeAdded.length; i++) {
      const element = toBeAdded[i];
      if (seen.has(element.value)) {
        continue;
      }
      if (element.children.every((c) => seen.has(c))) {
        sortedArray.push(element.value);
        seen.add(element.value);
        break;
      }
    }
  }
  return sortedArray;
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
  const depGraph = makeDepGraph(deps);
  const wrongs = updates.filter((u) => isWrong(u, depGraph));
  const sorted = wrongs.map((u) => sort(u, depGraph));

  const answer = sorted.reduce((acc, arr) => {
    const len = Math.floor(arr.length / 2);

    return acc + arr[len];
  }, 0);

  return answer;
};

// console.log(await part1());
console.log(await part2());
