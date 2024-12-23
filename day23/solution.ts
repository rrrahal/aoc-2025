import { getInputLineByLine } from "../utils/input";

export const part1 = async () => {
  const input: string[] = await getInputLineByLine("input.txt");
  const nodeValues = input.map((v) => v.split("-"));
  const graph: Record<string, Set<string>> = {};

  nodeValues.forEach((value) => {
    const v1 = value[0];
    const v2 = value[1];

    if (!graph[v1]) {
      graph[v1] = new Set();
    }
    if (!graph[v2]) {
      graph[v2] = new Set();
    }
  });

  createGraph(graph, nodeValues);
  const s = new Set();
  Object.keys(graph).forEach((v) => {
    const res = search(v, graph);
    res.forEach((r) => {
      s.add(r.join(","));
    });
  }, 0);

  return s.size;
};

const createGraph = (
  graph: Record<string, Set<string>>,
  relations: string[][],
) => {
  relations.forEach((relation) => {
    const n1 = relation[0];
    const n2 = relation[1];

    if (!n1 || !n2) {
      throw "something went wrong!";
    }

    graph[n1].add(n2);
    graph[n2].add(n1);
  });
};

const search = (initial: string, graph: Record<string, Set<string>>) => {
  const sets: string[][] = [];
  for (const val of graph[initial]) {
    if (val !== initial) {
      for (const val2 of graph[val]) {
        if (val !== val2) {
          if (
            graph[val2].has(initial) &&
            (initial.startsWith("t") ||
              val.startsWith("t") ||
              val2.startsWith("t"))
          ) {
            sets.push([initial, val, val2].sort((a, b) => a > b));
          }
        }
      }
    }
  }

  return sets;
};

console.log(await part1());
