import { SIDE_LENGTH } from "./constants";
import { DigitSelectors } from "./DigitSelectors";
import { SudokuHTMLHandler } from "./Sudoku/SudokuHTMLHandler";
import { SudokuValidator } from "./Sudoku/SudokuValidator";

/**
 * Representation of a node
 */
export class GridNode {

  constructor(private value: number | null = null, private canBeModified: boolean = false) { }

  /**
   * remove modification ability and resets value to null
   */
  reinitiate() {
    this.value = null;
    this.canBeModified = false;
  }

  isModifiable() {
    return this.canBeModified;
  }

  setModifiable(modif: boolean) {
    this.canBeModified = modif;
  }

  getValue() {
    return this.value;
  }

  setValue(value: number | null) {
    this.value = value;
  }

  /**
  * Node Generation for single square
  * @param row 
  * @param col 
  * @returns 
  */
  createSingleSquare(row: number, col: number, digits: DigitSelectors) {
    const square = document.createElement("div");
    const currentId = row * SIDE_LENGTH + col
    square.setAttribute("id", `square-${currentId}`);
    square.setAttribute("class", "square");
    // Should probably be put into HTMLHandler at some point
    square.addEventListener("click", () => {
      if (square.innerText === '') {
        const currentSelectedValue = digits.getCurrentSelectedID() + 1;
        const valueToEnter = currentSelectedValue > 0 ? `${currentSelectedValue}` : '';
        square.innerText = valueToEnter;
        if (!SudokuValidator.prototype.isCorrect(currentSelectedValue, row, col, currentId)) {
          square.classList.add("wrong");
        }


        DigitSelectors.checkBtnVisibility(Number(valueToEnter)); // should a button disappear
        SudokuValidator.recomputeWrongValues(currentId);
        SudokuValidator.checkEndGame();
      }
    })
    return square;
  }
}