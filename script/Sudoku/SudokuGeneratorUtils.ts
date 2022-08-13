/**
 * SudokuGeneratorUtils.ts
 * Collection of utility functions used while generating the sudoku matrix
 */

import { GridNode } from "../GridNode";
import { SIDE_LENGTH } from "../constants";

export class SudokuGeneratorUtils {

  constructor() { }

  /**
   * Check which values could fit into current evaluated square
   * @param matrix 
   * @param row 
   * @param col 
   * @returns 
   */
  getPossibleValuesForOneSquare(matrix: GridNode[][], row: number, col: number) {
    const possibilities = Array(SIDE_LENGTH).fill(0).map((_, i) => i + 1);
    const lineChecked = this.keepNonCommonOnLine(possibilities, matrix[row]);
    const columnChecked = this.keepNonCommonOnColumn(lineChecked, matrix, row, col);
    const allChecked = this.keepNonCommonOnSquare(columnChecked, matrix, row, col);
    return allChecked;
  }

  /**
   * While filling matrix, avoid column to go out of range
   * @param rowsend 
   * @param col 
   * @returns 
   */
  getNextSquareCol(rowsend: number, col: number) {
    if (rowsend != 0) return col;
    if (col + 1 > SIDE_LENGTH - 1) return 0;
    return col + 1;
  }

  /** sudoku line validation */
  keepNonCommonOnLine(possibles: number[], line: GridNode[]) {
    // d'abord récupérer les valeurs 
    const values = line.map(e => e.getValue());
    return possibles && possibles.filter(e => !values.includes(e));
  }

  /** Column validation */
  keepNonCommonOnColumn(possibilities: number[], matrix: GridNode[][], row: number, col: number) {
    const arr: number[] = [];
    for (let i = 0; i < row; i++) {
      const val = matrix[i][col].getValue();
      if (val && possibilities.includes(val)) arr.push(val);
    }
    return possibilities.filter(e => !arr.includes(e));
  }

  /**Sudoku sub-square validation*/
  keepNonCommonOnSquare(possibilities: number[], matrix: GridNode[][], row: number, col: number) {
    const arr: number[] = [];
    const { min: minR, max: maxR } = this.getMinMaxPos(row);
    const { min: minC, max: maxC } = this.getMinMaxPos(col);

    for (let row = minR; row < maxR; row++) {
      for (let col = minC; col < maxC; col++) {
        const val = matrix[row][col].getValue();
        if (val && possibilities.includes(val)) arr.push(val);
      }
    }

    return possibilities.filter(e => !arr.includes(e));
  }

  /**
 * Find which indexes will be checked when verifying a sudoku sub-square
 * @param arg 
 * @returns 
 */
  getMinMaxPos(arg: number) {
    let min = 0;
    let max = 3;

    if (arg >= 3 && arg < 6) {
      min = 3;
      max = 6;
    } else if (arg >= 6) {
      min = 6;
      max = 9;
    }

    return { min, max };
  }
}