import { B, W, E, P, N } from "./constants.js";

const getCells = () => {
  let cells = [],
    y = 0;
  while (y < 8) {
    let x = [];
    while (x.length < 8) {
      x.push(E);
    }
    cells.push(x);
    y++;
  }
  cells[3][4] = B;
  cells[3][3] = W;
  cells[4][3] = B;
  cells[4][4] = W;
  return cells;
};

export const cells = getCells();

// export const patterns = [
//   [0, 1, 2],
//   [3, 4, 5],
//   [6, 7, 8],
//   [0, 3, 6],
//   [1, 4, 7],
//   [2, 5, 8],
//   [0, 4, 8],
//   [2, 4, 6],
// ];

export const checkWin = (board) => {
  //   let result = "";
  //   patterns.forEach((pattern) => {
  //     const firstPlayer = board[pattern[0]];
  //     if (firstPlayer == "") return;
  //     let foundWinningPattern = true;
  //     pattern.forEach((idx) => {
  //       if (board[idx] != firstPlayer) {
  //         foundWinningPattern = false;
  //       }
  //     });
  //     if (foundWinningPattern) {
  //       result = { winner: board[pattern[0]], state: "won" };
  //     }
  //   });
  //   return result;
};

export const checkTie = (board) => {
  //   let filled = true;
  //   for (let cell in board) {
  //     if (board[cell] == "") {
  //       filled = false;
  //     }
  //   }
  //   return filled;
};

export const makeMove = (board, y, x, player) => {
  // console.log("MOVE", board, y, x, player);
  // reverse
  let newBoard = reverse(board, player, y, x);

  // update board
  player = 1 - player;
  newBoard = searchPlaceble(newBoard, player);
  return newBoard;
};

function reverse(board, user, y, x) {
  for (let dy = -1; dy <= 1; dy++) {
    for (let dx = -1; dx <= 1; dx++) {
      if (dx === 0 && dy === 0) {
        continue;
      }

      let nx = x + dx;
      let ny = y + dy;
      if (!isOnBoard(ny, nx) || !(board[ny][nx] === 1 - user)) {
        continue;
      }

      let step = 2;
      let flipable = false;
      let flipable_points = [
        [x, y],
        [nx, ny],
      ];
      while (true) {
        nx = x + dx * step;
        ny = y + dy * step;

        if (!isOnBoard(ny, nx) || board[ny][nx] === P || board[ny][nx] === E) {
          break;
        } else if (board[ny][nx] === user) {
          flipable = true;
          break;
        }
        flipable_points.push([nx, ny]);
        step += 1;
      }

      if (flipable) {
        for (const p of flipable_points) {
          board[p[1]][p[0]] = user;
        }
      }
    }
  }
  return board;
}

function isOnBoard(y, x) {
  if (y < 0 || y >= N || x < 0 || x >= N) {
    return false;
  }
  return true;
}

export function searchPlaceble(board, player) {
  let user = player;

  for (let y = 0; y < N; y++) {
    for (let x = 0; x < N; x++) {
      if (board[y][x] === B || board[y][x] === W) {
        continue;
      }

      board[y][x] = E;

      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          if (dx === 0 && dy === 0) {
            continue;
          }

          let nx = x + dx;
          let ny = y + dy;
          if (!isOnBoard(ny, nx) || !(board[ny][nx] === 1 - user)) {
            continue;
          }

          while (true) {
            nx = nx + dx;
            ny = ny + dy;
            if (
              !isOnBoard(ny, nx) ||
              board[ny][nx] === E ||
              board[ny][nx] === P
            ) {
              break;
            } else if (board[ny][nx] === 1 - user) {
              continue;
            } else {
              board[y][x] = P;
              break;
            }
          }
        }
      }
    }
  }

  return board;
}
