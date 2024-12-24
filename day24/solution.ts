import { readInput } from "../utils/input";

type Operation = {
  left: string;
  right: string;
  operand: string;
  result: string;
  done: boolean;
};

export const part1 = async () => {
  const input: string = await readInput("input.txt");
  const [inputState, ops] = input.split("\n\n");

  const state: Record<string, number> = inputState
    .split("\n")
    .map((l) => l.split(": "))
    .reduce((acc, pair) => {
      acc[pair[0]] = parseInt(pair[1]);
      return acc;
    }, {});

  let doneOps = 0;

  const operations = ops
    .split("\n")
    .map((l) => {
      const [operation, result] = l.split(" -> ");
      const [v1, operand, v2] = operation.split(" ");

      return {
        left: v1,
        right: v2,
        operand,
        result,
        done: false,
      };
    })
    .filter((op) => op.right !== undefined);

  while (doneOps < operations.length) {
    operations.forEach((op) => {
      if (!op.done) {
        doneOps = executeOp(op, state, doneOps)[1];
      }
    });
  }

  const zKeys = Object.keys(state)
    .filter((k) => k.startsWith("z"))
    .sort((a, b) => b > a);
  const result = parseInt(zKeys.map((k) => state[k]).join(""), 2);
  return result;
};

const executeOp = (
  op: Operation,
  state: Record<string, number>,
  executedOps: number,
): [Record<string, number>, number] => {
  if (state[op.right] === undefined || state[op.left] === undefined) {
    return [state, executedOps];
  }

  const v1 = state[op.right];
  const v2 = state[op.left];

  if (op.operand === "AND") {
    const res = v1 && v2;
    state[op.result] = res;
    op.done = true;
    return [state, executedOps + 1];
  }
  if (op.operand === "OR") {
    const res = v1 || v2;
    state[op.result] = res;
    op.done = true;
    return [state, executedOps + 1];
  }
  if (op.operand === "XOR") {
    const res = v1 ^ v2;
    state[op.result] = res;
    op.done = true;
    return [state, executedOps + 1];
  }
  throw "unsuported op";
};

console.log(await part1());
