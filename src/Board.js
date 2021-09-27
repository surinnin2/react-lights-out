import React, { useState } from "react";
import Cell from "./Cell";
import "./Board.css";

/** Game board of Lights out.
 *
 * Properties:
 *
 * - nrows: number of rows of board
 * - ncols: number of cols of board
 * - chanceLightStartsOn: float, chance any cell is lit at start of game
 *
 * State:
 *
 * - board: array-of-arrays of true/false
 *
 *    For this board:
 *       .  .  .
 *       O  O  .     (where . is off, and O is on)
 *       .  .  .
 *
 *    This would be: [[f, f, f], [t, t, f], [f, f, f]]
 *
 *  This should render an HTML table of individual <Cell /> components.
 *
 *  This doesn't handle any clicks --- clicks are on individual cells
 *
 **/

function Board({ nrows = 3, ncols = 3, chanceLightStartsOn = 0.5 }) {
  const [board, setBoard] = useState(createBoard());

  /** create a board nrows high/ncols wide, each cell randomly lit or unlit */
  function createBoard() {
    let initialBoard = [];
    for (let r = 0; r < nrows; r++) {
      let row = [];
      for (let c = 0; c < ncols; c++) {
        row.push(Math.random() < chanceLightStartsOn);
      }
      initialBoard.push(row);
    }
    return initialBoard;
  }

  /* Check if the player has won */
  function hasWon() {
    return board.every(row => row.every(cell => !cell));
  }

  /* Flip cells around a given cell */
  function flipCellsAround(coord) {
    setBoard(oldBoard => {
      const [y, x] = coord.split("-").map(Number);

      const flipCell = (y, x, boardCopy) => {
        // if this coord is actually on board, flip it

        if (x >= 0 && x < ncols && y >= 0 && y < nrows) {
          boardCopy[y][x] = !boardCopy[y][x];
        }
      };

      const copy = oldBoard.map(row => [...row]);

      flipCell(y, x, copy);
      flipCell(y - 1, x, copy);
      flipCell(y + 1, x, copy);
      flipCell(y, x - 1, copy);
      flipCell(y, x + 1, copy);
      return copy;
    });
  }

  //render win message if hasWon returns true
  if (hasWon()) {
    return <div>You WIN!</div>;
  }

  // make board
  let gameBoard = [];

  for (let y = 0; y < nrows; y++) {
    let row = [];
    for (let x = 0; x < ncols; x++) {
      let coord = `${y}-${x}`;
      row.push(
        <Cell
          key={coord}
          isLit={board[y][x]}
          flipCellsAroundMe={() => flipCellsAround(coord)}
        />
      );
    }
    gameBoard.push(
      <tr key={y}>
        {row}
      </tr>);
  }

  return (
    <table className="Board">
      <tbody>{gameBoard}</tbody>
    </table>
  );
}

export default Board;
