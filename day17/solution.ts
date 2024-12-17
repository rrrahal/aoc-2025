import { readInput } from "../utils/input";

export const part1 = async () => {
  const text: string = await readInput("input.txt");
  const registers = text
    .split("\n\n")[0]
    .split("\n")
    .map((l) => parseInt(l.split(":")[1]));

  const instructions = text
    .split("\n\n")[1]
    .split(":")[1]
    .split(",")
    .map((l) => parseInt(l));

  const result = run(registers, instructions);
  return result.join(",");
};

const run = (registers: number[], instructions: number[]) => {
  let ip = 0;
  const maxInstruction = instructions.length;
  const output: number[] = [];

  while (ip < maxInstruction) {
    ip = performInstruction(ip, instructions, registers, output);
  }

  return output;
};

// Executes the operation in the IP and returns the new IP
const performInstruction = (
  ip: number,
  instructions: number[],
  registers: number[],
  output: number[],
): number => {
  const opCode = instructions[ip];
  const operand = instructions[ip + 1];
  const result = execute(opCode, operand, registers, output);
  if (opCode === 3 && registers[0] !== 0) {
    return result;
  }
  return ip + 2;
};

const execute = (
  opCode: number,
  operand: number,
  registers: number[],
  output: number[],
) => {
  if (opCode === 0) {
    const numerator = registers[0];
    const denominator = Math.pow(2, getComboOperandValue(operand, registers));
    registers[0] = Math.trunc(numerator / denominator);
    return 0;
  }
  if (opCode === 1) {
    registers[1] = registers[1] ^ operand;
    return 0;
  }
  if (opCode === 2) {
    const combo = getComboOperandValue(operand, registers);
    registers[1] = combo % 8;
    return 0;
  }
  if (opCode === 3) {
    const a = registers[0];
    if (a === 0) {
      return 0;
    }
    return operand;
  }
  if (opCode === 4) {
    registers[1] = registers[1] ^ registers[2];
    return 0;
  }
  if (opCode === 5) {
    const combo = getComboOperandValue(operand, registers);
    output.push(combo % 8);
    return 0;
  }
  if (opCode === 6) {
    const numerator = registers[0];
    const denominator = Math.pow(2, getComboOperandValue(operand, registers));
    registers[1] = Math.trunc(numerator / denominator);
    return 0;
  }
  if (opCode === 7) {
    const numerator = registers[0];
    const denominator = Math.pow(2, getComboOperandValue(operand, registers));
    registers[2] = Math.trunc(numerator / denominator);
    return 0;
  }

  throw new Error(`Unknown Opcode ${opCode}`);
};

const getComboOperandValue = (operand: number, registers: number[]): number => {
  if (operand >= 0 && operand <= 3) {
    return operand;
  }
  if (operand === 4) {
    return registers[0];
  }
  if (operand === 5) {
    return registers[1];
  }
  if (operand === 6) {
    return registers[2];
  }

  throw new Error(`unknown operand! ${operand}`);
};

const runWithCache = (
  registers: number[],
  instructions: number[],
  target: number[],
  cache: Set<string>,
) => {
  let ip = 0;
  const maxInstruction = instructions.length;
  const output: number[] = [];
  const possibleWrong: string[] = [];

  while (ip < maxInstruction) {
    if (cache.has(`${ip},${registers[0]}`)) {
      return false;
    }

    possibleWrong.push(`${ip},${registers[0]},${registers[1]},${registers[2]}`);
    ip = performInstruction(ip, instructions, registers, output);
    if (!output.every((o, index) => target[index] === o)) {
      possibleWrong.forEach((p) => {
        cache.add(p);
      });
      return false;
    }
  }

  if (output.length !== target.length) {
    return false;
  }

  return output;
};

const part2 = async () => {
  const text: string = await readInput("input.txt");
  const registers = text
    .split("\n\n")[0]
    .split("\n")
    .map((l) => parseInt(l.split(":")[1]));

  const instructions = text
    .split("\n\n")[1]
    .split(":")[1]
    .split(",")
    .map((l) => parseInt(l));

  let i = 1;

  registers[0] = i;
  const cache = new Set<string>();
  let result = runWithCache(registers, instructions, instructions, cache);
  while (result === false) {
    console.log(i);
    i += 1;
    registers[0] = i;
    result = runWithCache(registers, instructions, instructions, cache);
  }

  return i;
};

// console.log(await part1());
console.log(await part2());
