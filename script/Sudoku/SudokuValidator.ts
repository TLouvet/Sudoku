import { SIDE_LENGTH } from "../constants";
import { SudokuGeneratorUtils } from "./SudokuGeneratorUtils";

export class SudokuValidator {

  /**
   * Checks for an entry if it does not conflict with already known information
   * @param value 
   * @param row 
   * @param col 
   * @returns 
   */
  isCorrect(value: number, row: number, col: number, current: number): boolean {
    const firstRowIndex = row * SIDE_LENGTH;
    // Row 
    for (let i = firstRowIndex; i < firstRowIndex + SIDE_LENGTH; i++) {
      if (i === current) continue;

      const node = document.getElementById(`square-${i}`);
      if (node?.innerText === String(value)) return false;
    }

    // Column
    for (let j = col; j < 81; j += 9) {
      if (j === current) continue;

      const node = document.getElementById(`square-${j}`);
      if (node?.innerText === String(value)) return false;
    }

    // Sub square
    const { min: minR, max: maxR } = SudokuGeneratorUtils.prototype.getMinMaxPos(row);
    const { min: minC, max: maxC } = SudokuGeneratorUtils.prototype.getMinMaxPos(col);

    for (let x = minR; x < maxR; x++) {
      for (let y = minC; y < maxC; y++) {
        if (x * SIDE_LENGTH + y === current) continue;

        const node = document.getElementById(`square-${x * SIDE_LENGTH + y}`);
        if (node?.innerText === String(value)) return false;
      }
    }

    return true;
  }

  /**
   * If the whole grid is filled with no error, it's the end
   * @returns 
   */
  isGridEnd() {
    for (let i = 0; i < SIDE_LENGTH * SIDE_LENGTH; i++) {
      const node = document.getElementById(`square-${i}`);
      if (node?.innerHTML == '' || node?.classList.contains("wrong")) {
        return false;
      }
    }
    return true;
  }
}