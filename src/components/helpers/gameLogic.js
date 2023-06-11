import { B, W, E, P, N } from "./constants.js";

export const getCells = () => {
  let cells = [],
    y = 0;
  while (y < N) {
    let x = [];
    while (x.length < N) {
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

export const checkStatus = (board, msgSkip) => {
  let [cntBlack, cntWhite, cnt_placeble] = countToken(board);
  let gameover = false;
  let skip = false;
  let message = "";
  if (cntBlack + cntWhite === N * N) {
    gameover = true;
  } else if (cntBlack === 0 || cntWhite === 0) {
    gameover = true;
  } else if (cnt_placeble === 0) {
    skip = true;
  }
  if (!msgSkip && skip) {
    gameover = true;
    skip = false;
    message = "Skipped both!";
  }
  if (gameover) {
    if (cntBlack > cntWhite) {
      message = "Black won!";
    } else if (cntBlack < cntWhite) {
      message = "White won!";
    } else {
      message = "Tie!";
    }
  }
  return {
    skip,
    message,
    cntBlack,
    cntWhite,
    gameover,
  };
};

const countToken = (board) => {
  let b = 0;
  let w = 0;
  let p = 0;
  for (let y = 0; y < N; y++) {
    for (let x = 0; x < N; x++) {
      if (board[y][x] === B) {
        b++;
      } else if (board[y][x] === W) {
        w++;
      } else if (board[y][x] === P) {
        p++;
      }
    }
  }
  return [b, w, p];
};

export const makeMove = (board, y, x, player) => {
  let newBoard = reverse(board, player, y, x);
  player = 1 - player;
  newBoard = searchPlaceble(newBoard, player);
  return newBoard;
};

function reverse(board, player, y, x) {
  for (let dy = -1; dy <= 1; dy++) {
    for (let dx = -1; dx <= 1; dx++) {
      if (dx === 0 && dy === 0) {
        continue;
      }
      let nx = x + dx;
      let ny = y + dy;
      if (!isOnBoard(ny, nx) || !(board[ny][nx] === 1 - player)) {
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
        } else if (board[ny][nx] === player) {
          flipable = true;
          break;
        }
        flipable_points.push([nx, ny]);
        step += 1;
      }
      if (flipable) {
        for (const p of flipable_points) {
          board[p[1]][p[0]] = player;
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
          if (!isOnBoard(ny, nx) || !(board[ny][nx] === 1 - player)) {
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
            } else if (board[ny][nx] === 1 - player) {
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

export function getUserColor(player) {
  if (player === B) {
    return "Black";
  }
  return "White";
}
