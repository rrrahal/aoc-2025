// TODO: we need to iterate over all shortest paths instead of only one
enum command {
  UP = "^",
  DOWN = "v",
  LEFT = "<",
  RIGHT = ">",
  PRESS = "A",
  NOOP = "NOOP",
}
// +---+---+---+
// | 7 | 8 | 9 |
// +---+---+---+
// | 4 | 5 | 6 |
// +---+---+---+
// | 1 | 2 | 3 |
// +---+---+---+
//     | 0 | A |
//     +---+---+
//
//     +---+---+
//     | ^ | A |
// +---+---+---+
// | < | v | > |
// +---+---+---+

const KEYS = [
  ["7", "8", "9"],
  ["4", "5", "6"],
  ["1", "2", "3"],
  ["NOOP", "0", "A"],
];

type Position = [number, number];

const ARROWS = [
  [command.NOOP, command.UP, command.PRESS],
  [command.LEFT, command.DOWN, command.RIGHT],
];

// given a keypad target, e.g 029A
// what is the sequence of arrow commands that output this code
const getKeysCommands = (target: string) => {
  let position = [3, 2] as Position;
  const q = Array.from(target);
  const movements: command[] = [];

  while (q.length) {
    const target = q.shift()!;
    const [mov, pos] = getNumericShortestPath(target, position);
    movements.push(...mov);
    position = pos;
  }

  return movements;
};

const getNumericShortestPath = (
  target: string,
  initialPosition: Position,
): [command[], Position] => {
  const q: [Position, command[]][] = [[initialPosition, []]];
  const seen: Set<string> = new Set();

  while (q.length) {
    const [pos, commands] = q.shift()!;
    if (KEYS[pos[0]][pos[1]] === target) {
      return [[...commands, command.PRESS], pos];
    }

    if (seen.has(JSON.stringify(pos))) {
      continue;
    }
    seen.add(JSON.stringify(pos));

    const neigh = getNeighbors(pos, KEYS);
    neigh.forEach((n) => {
      const key = JSON.stringify(n[0]);
      if (!seen.has(key)) {
        q.push([n[0], [...commands, n[1]]]);
      }
    });
  }

  throw new Error("could not find path");
};

const getNeighbors = (pos: Position, pad: any): [Position, command][] => {
  const posibilities = [
    [[pos[0] - 1, pos[1]], command.UP],
    [[pos[0] + 1, pos[1]], command.DOWN],
    [[pos[0], pos[1] - 1], command.LEFT],
    [[pos[0], pos[1] + 1], command.RIGHT],
  ] as [Position, command][];

  return posibilities.filter((n) => {
    const p = n[0];
    try {
      const n = pad[p[0]][p[1]];
      if (!n || n === command.NOOP) {
        return false;
      }
      return true;
    } catch (e) {
      return false;
    }
  });
};

const getSingleArrowCommandSeq = (
  target: command,
  pos: Position,
): [command[], Position] => {
  const q: [Position, command[]][] = [[pos, []]];
  const seen: Set<string> = new Set();

  while (q.length) {
    const [p, cmds] = q.shift()!;
    if (ARROWS[p[0]][p[1]] === target) {
      return [[...cmds, command.PRESS], p];
    }

    if (seen.has(JSON.stringify(p))) {
      continue;
    }
    seen.add(JSON.stringify(p));

    const neigh = getNeighbors(p, ARROWS);

    neigh.forEach((n) => {
      q.push([n[0], [...cmds, n[1]]]);
    });
  }

  throw new Error("path not found for arrows");
};

const getArrowCommands = (cmds: command[]) => {
  let pos = [0, 2] as Position;
  const mov: command[] = [];

  while (cmds.length) {
    const target = cmds.shift()!;
    const [c, p] = getSingleArrowCommandSeq(target, pos);
    pos = p;
    mov.push(...c);
  }
  return mov;
};

const part1 = () => {
  const tests = ["029A", "980A", "179A", "456A", "379A"];
  let result = 0;

  tests.forEach((t) => {
    const initialMovements = getKeysCommands(t);
    const nextMov = getArrowCommands(initialMovements);
    const lastMov = getArrowCommands(nextMov);
    const number = parseInt(t.slice(0, -1));
    console.log(lastMov.length, number);

    result += number * lastMov.length;
  });

  return result;
};

console.log(part1());
