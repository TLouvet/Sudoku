import { SIDE_LENGTH } from "../constants";
import { GridNode } from "../GridNode";
import { SudokuGeneratorUtils } from "./SudokuGeneratorUtils";

/**
 * Representation of the code matrix used to generate the grid
 */
export class SudokuMatrixComponent {

  constructor(private matrix: GridNode[][] = []) {
    this.initiate();
  }

  /**
   * Initial matrix fill
   */
  private initiate() {
    for (let i = 0; i < SIDE_LENGTH; i++) {
      const arr = [];
      for (let j = 0; j < SIDE_LENGTH; j++) {
        arr.push(new GridNode());
      }
      this.matrix.push(arr);
    }
  }

  /**
   * get the sudoku matrix
   * @returns any[][]
   */
  getMatrix() {
    return this.matrix;
  }

  startFillProcess() {
    this.fill(this.matrix, 0, 0);
  }

  /**
   * Recursively fill matrix and backtracks when no solution found
   * Fill Matrix column by column, from left to right, top to bottom
   * @param matrix 
   * @param col 
   * @param row 
   * @returns 
   */
  fill(matrix: GridNode[][], col: number, row: number) {
    const possibilities = SudokuGeneratorUtils.prototype.getPossibleValuesForOneSquare(matrix, row, col);
    if (possibilities.length === 0) {
      return null;
    }

    // If we get to this specific point, then we have found a complete grid and need to quit as the for loop would reset to 0;
    if (row == SIDE_LENGTH - 1 && col == SIDE_LENGTH - 1) {
      matrix[row][col].setValue(possibilities[0]);
      return matrix;
    }

    // Shuffle Array of possibilities to generate multiple grids
    possibilities.sort(() => Math.random() > 0.5 ? 1 : -1);

    // ensure next does not go out of range
    const rowsend = row + 1 > SIDE_LENGTH - 1 ? 0 : row + 1;
    const colsend = SudokuGeneratorUtils.prototype.getNextSquareCol(rowsend, col);

    for (let i = 0; i < possibilities.length; i++) {
      matrix[row][col].setValue(possibilities[i]);
      if (this.fill(matrix, colsend, rowsend)) {
        return matrix; // if we get here, then we have a potential valid solution for current square
      };
    }

    // No solution while following current path, let's backtrack
    matrix[row][col].setValue(null);
    return null;
  }

  /**
   * Reinitiate all of the squares and matrix values
   */
  clear() {
    for (let i = 0; i < SIDE_LENGTH; i++) {
      for (let j = 0; j < SIDE_LENGTH; j++) {
        this.matrix[i][j].reinitiate();
      }
    }
  }
}