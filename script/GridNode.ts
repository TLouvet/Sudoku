import { SIDE_LENGTH } from "./constants";
import { Sudoku } from "./Sudoku";
import { SudokuHTMLHandler } from "./SudokuHTMLHandler";

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
  createSingleSquare(row: number, col: number) {
    const square = document.createElement("div");
    square.setAttribute("id", `square-${row * SIDE_LENGTH + col}`);
    square.setAttribute("class", "square");
    // Make selector buttons change depending on selection
    square.addEventListener("click", () => {
      if (square.innerText === '') {
        // square is empty
        if (!Sudoku.prototype.isCorrect(Number(SudokuHTMLHandler.currentSelectedBtn), row, col)) {
          square.classList.add("wrong");
        } else {
          square.classList.remove("wrong");
        }

        square.innerText = SudokuHTMLHandler.currentSelectedBtn;
      }
    })
    return square;
  }
}