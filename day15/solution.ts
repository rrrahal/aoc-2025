import { readInput } from "../utils/input";

type Pos = {
  i: number;
  j: number;
};

enum Move {
  UP = "^",
  DOWN = "v",
  LEFT = "<",
  RIGHT = ">",
}

export const part1 = async () => {
  const text: string = await readInput("input.txt");
  const [field, commands] = text.split("\n\n");
  const moves = parseCommands(commands);
  const [board, initialPos] = parseField(field);

  let pos = initialPos;
  moves.forEach((m) => {
    // console.log("\n", m);
    // board.forEach((b) => {
    //   console.log(b.join(""));
    // });
    pos = makeMove(m, board, pos);
  });

  let result = 0;
  for (let i = 0; i < board.length; i++) {
    for (let j = 0; j < board[0].length; j++) {
      if (board[i][j] === "O") {
        result += 100 * i + j;
      }
    }
  }

  return result;
};

const parseField = (field: string): [string[][], Pos] => {
  const result: string[][] = [];
  let initial: Pos = { i: 0, j: 0 };
  field.split("\n").forEach((line, index) => {
    const column = Array.from(line);
    result.push(column);
    const hasInitial = column.findIndex((c) => c === "@");
    if (hasInitial !== -1) {
      initial.i = index;
      initial.j = hasInitial;
    }
  });

  return [result, initial];
};

const parseCommands = (commands: string) => {
  const valid = ["v", "^", ">", "<"];
  const result = Array.from(commands).filter((c) => valid.includes(c));
  return result.map((c) => {
    if (c === "^") {
      return Move.UP;
    }
    if (c === ">") {
      return Move.RIGHT;
    }
    if (c === "<") {
      return Move.LEFT;
    }
    if (c === "v") {
      return Move.DOWN;
    }
    throw new Error("unknown move");
  });
};

const getNewPos = (move: Move, pos: Pos): Pos => {
  if (move === Move.UP) {
    return { i: pos.i - 1, j: pos.j };
  }
  if (move === Move.DOWN) {
    return { i: pos.i + 1, j: pos.j };
  }
  if (move === Move.RIGHT) {
    return { i: pos.i, j: pos.j + 1 };
  }
  if (move === Move.LEFT) {
    return { i: pos.i, j: pos.j - 1 };
  }

  throw new Error("unknown move");
};

const push = (board: string[][], move: Move, newPos: Pos) => {
  if (move === Move.UP) {
    let i = newPos.i;
    let j = newPos.j;
    while (board[i][j] !== "#") {
      if (board[i][j] === ".") {
        board[i][j] = "O";
        board[newPos.i][newPos.j] = "@";
        return true;
      }
      i--;
    }
  }
  if (move === Move.DOWN) {
    let i = newPos.i;
    let j = newPos.j;
    while (board[i][j] !== "#") {
      if (board[i][j] === ".") {
        board[i][j] = "O";
        board[newPos.i][newPos.j] = "@";
        return true;
      }
      i++;
    }
  }
  if (move === Move.RIGHT) {
    let i = newPos.i;
    let j = newPos.j;
    while (board[i][j] !== "#") {
      if (board[i][j] === ".") {
        board[i][j] = "O";
        board[newPos.i][newPos.j] = "@";
        return true;
      }
      j++;
    }
  }
  if (move === Move.LEFT) {
    let i = newPos.i;
    let j = newPos.j;
    while (board[i][j] !== "#") {
      if (board[i][j] === ".") {
        board[i][j] = "O";
        board[newPos.i][newPos.j] = "@";
        return true;
      }
      j--;
    }
  }
  return false;
};

const makeMove = (move: Move, board: string[][], robot: Pos) => {
  const newPos = getNewPos(move, robot);
  if (board[newPos.i][newPos.j] === "#") {
    return robot;
  } else if (board[newPos.i][newPos.j] === ".") {
    board[robot.i][robot.j] = ".";
    board[newPos.i][newPos.j] = "@";
    return newPos;
  } else {
    if (push(board, move, newPos)) {
      board[robot.i][robot.j] = ".";
      return newPos;
    }
    return robot;
  }
};

const parseField2 = (field: string): [string[][], Pos] => {
  const result: string[][] = [];
  let initial: Pos = { i: 0, j: 0 };
  field.split("\n").forEach((line, index) => {
    const column = Array.from(line)
      .map((el) => {
        if (el === "#") {
          return ["#", "#"];
        }
        if (el === "O") {
          return ["[", "]"];
        }
        if (el === "@") {
          return ["@", "."];
        }
        if (el === ".") {
          return [".", "."];
        }
        throw new Error("unkown element");
      })
      .flat();

    result.push(column);
    const hasInitial = column.findIndex((c) => c === "@");
    if (hasInitial !== -1) {
      initial.i = index;
      initial.j = hasInitial;
    }
  });

  return [result, initial];
};

const push2 = (board: string[][], move: Move, newPos: Pos) => {
  if (move === Move.UP || move === Move.DOWN) {
    if (board[newPos.i][newPos.j] === "]") {
      const box = [
        { i: newPos.i, j: newPos.j - 1 },
        { i: newPos.i, j: newPos.j },
      ];
      if (canPushBox(box, board, move)) {
        pushBox(box, board, move);
        return true;
      } else {
        return false;
      }
    } else {
      const box = [
        { i: newPos.i, j: newPos.j },
        { i: newPos.i, j: newPos.j + 1 },
      ];
      if (canPushBox(box, board, move)) {
        pushBox(box, board, move);
        return true;
      } else {
        return false;
      }
    }
  }

  if (move === Move.RIGHT) {
    let i = newPos.i;
    let j = newPos.j;
    while (board[i][j] !== "#") {
      if (board[i][j] === ".") {
        board[i][j] = "]";
        j--;
        while (j !== newPos.j) {
          if (board[i][j] === "]") {
            board[i][j] = "[";
          } else if (board[i][j] === "[") {
            board[i][j] = "]";
          }
          j--;
        }
        board[newPos.i][newPos.j] = "@";
        return true;
      }
      j++;
    }
  }
  if (move === Move.LEFT) {
    let i = newPos.i;
    let j = newPos.j;
    while (board[i][j] !== "#") {
      if (board[i][j] === ".") {
        board[i][j] = "[";
        j++;
        while (j !== newPos.j) {
          if (board[i][j] === "]") {
            board[i][j] = "[";
          } else if (board[i][j] === "[") {
            board[i][j] = "]";
          }
          j++;
        }
        board[newPos.i][newPos.j] = "@";
        return true;
      }
      j--;
    }
  }
  return false;
};

const pushBox = (box: Pos[], board: string[][], dir: Move) => {
  const fBox = box[0];
  const sBox = box[1];
  let direction = 0;
  if (dir === Move.UP) {
    direction = -1;
  } else {
    direction = 1;
  }
  if (
    board[fBox.i + direction][fBox.j] === "." &&
    board[sBox.i + direction][sBox.j] === "."
  ) {
    board[fBox.i + direction][fBox.j] = "[";
    board[sBox.i + direction][sBox.j] = "]";
    board[fBox.i][fBox.j] = ".";
    board[sBox.i][sBox.j] = ".";
    return;
  }
  if (board[fBox.i + direction][fBox.j] === ".") {
    pushBox(
      [
        { i: sBox.i + direction, j: sBox.j },
        { i: sBox.i + direction, j: sBox.j + 1 },
      ],
      board,
      dir,
    );
    board[fBox.i + direction][fBox.j] = "[";
    board[sBox.i + direction][sBox.j] = "]";
    board[fBox.i][fBox.j] = ".";
    board[sBox.i][sBox.j] = ".";
    return;
  }
  if (board[sBox.i + direction][sBox.j] === ".") {
    pushBox(
      [
        { i: fBox.i + direction, j: fBox.j - 1 },
        { i: fBox.i + direction, j: fBox.j },
      ],
      board,
      dir,
    );
    board[fBox.i + direction][fBox.j] = "[";
    board[sBox.i + direction][sBox.j] = "]";
    board[fBox.i][fBox.j] = ".";
    board[sBox.i][sBox.j] = ".";
    return;
  }

  if (
    board[fBox.i + direction][fBox.j] === "[" &&
    board[sBox.i + direction][sBox.j] === "]"
  ) {
    pushBox(
      [
        { i: fBox.i + direction, j: fBox.j },
        { i: sBox.i + direction, j: sBox.j },
      ],
      board,
      dir,
    );
    board[fBox.i + direction][fBox.j] = "[";
    board[sBox.i + direction][sBox.j] = "]";
    board[fBox.i][fBox.j] = ".";
    board[sBox.i][sBox.j] = ".";
    return;
  }

  pushBox(
    [
      { i: fBox.i + direction, j: fBox.j - 1 },
      { i: fBox.i + direction, j: fBox.j },
    ],
    board,
    dir,
  );
  pushBox(
    [
      { i: sBox.i + direction, j: sBox.j },
      { i: sBox.i + direction, j: sBox.j + 1 },
    ],
    board,
    dir,
  );
  board[fBox.i + direction][fBox.j] = "[";
  board[sBox.i + direction][sBox.j] = "]";
  board[fBox.i][fBox.j] = ".";
  board[sBox.i][sBox.j] = ".";
  return;
};

const canPushBox = (box: Pos[], board: string[][], dir: Move) => {
  const fBox = box[0];
  const sBox = box[1];
  let direction = 0;
  if (dir === Move.UP) {
    direction = -1;
  } else {
    direction = 1;
  }
  if (
    board[fBox.i + direction][fBox.j] === "." &&
    board[sBox.i + direction][sBox.j] === "."
  ) {
    return true;
  }
  if (
    board[fBox.i + direction][fBox.j] === "#" ||
    board[sBox.i + direction][sBox.j] === "#"
  ) {
    return false;
  }
  if (board[fBox.i + direction][fBox.j] === ".") {
    return canPushBox(
      [
        { i: sBox.i + direction, j: sBox.j },
        { i: sBox.i + direction, j: sBox.j + 1 },
      ],
      board,
      dir,
    );
  }
  if (board[sBox.i + direction][sBox.j] === ".") {
    return canPushBox(
      [
        { i: fBox.i + direction, j: fBox.j - 1 },
        { i: fBox.i + direction, j: fBox.j },
      ],
      board,
      dir,
    );
  }
  if (
    board[fBox.i + direction][fBox.j] === "[" &&
    board[sBox.i + direction][sBox.j] === "]"
  ) {
    return canPushBox(
      [
        { i: fBox.i + direction, j: fBox.j },
        { i: sBox.i + direction, j: sBox.j },
      ],
      board,
      dir,
    );
  }

  return (
    canPushBox(
      [
        { i: fBox.i + direction, j: fBox.j - 1 },
        { i: fBox.i + direction, j: fBox.j },
      ],
      board,
      dir,
    ) &&
    canPushBox(
      [
        { i: sBox.i + direction, j: sBox.j },
        { i: sBox.i + direction, j: sBox.j + 1 },
      ],
      board,
      dir,
    )
  );
};

const makeMove2 = (move: Move, board: string[][], robot: Pos) => {
  const newPos = getNewPos(move, robot);
  if (board[newPos.i][newPos.j] === "#") {
    return robot;
  } else if (board[newPos.i][newPos.j] === ".") {
    board[robot.i][robot.j] = ".";
    board[newPos.i][newPos.j] = "@";
    return newPos;
  } else {
    if (push2(board, move, newPos)) {
      board[robot.i][robot.j] = ".";
      board[newPos.i][newPos.j] = "@";
      return newPos;
    }
    return robot;
  }
};

const part2 = async () => {
  const text: string = await readInput("input.txt");
  const [field, commands] = text.split("\n\n");
  const moves = parseCommands(commands);
  const [board, initialPos] = parseField2(field);

  let pos = initialPos;
  moves.forEach((m) => {
    // console.log("\n", m);
    // board.forEach((b) => {
    //   console.log(b.join(""));
    // });
    pos = makeMove2(m, board, pos);
  });

  let result = 0;
  for (let i = 0; i < board.length; i++) {
    for (let j = 0; j < board[0].length; j++) {
      if (board[i][j] === "[") {
        result += 100 * i + j;
      }
    }
  }
  // console.log("\n\n\n");
  // board.forEach((b) => {
  //   console.log(b.join(""));
  // });

  return result;
};

// console.log(await part1());
console.log(await part2());
