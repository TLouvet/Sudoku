import { SIDE_LENGTH } from "../constants";
import { DigitSelectors } from "../DigitSelectors";
import { GridNode } from "../GridNode";
import { SudokuValidator } from "./SudokuValidator";

export class SudokuHTMLHandler {
  private currentSelectedBtn: string = "";

  constructor() { }

  getCurrentSelectedValue() {
    return this.currentSelectedBtn;
  }

  setCurrentSelectedValue(val: string) {
    this.currentSelectedBtn = val;
  }

  /**
   *Html/css matrix representation initial creation -- generates only the squares, not the content
   *@param {string} - id -- Tag ID to add board node  
   */
  createBoard(id: string, digits: DigitSelectors) {
    const boardContainer = document.getElementById(id);
    if (!boardContainer) {
      throw new Error("Aucun élément n'existe avec l'id donné");
    }

    for (let i = 0; i < SIDE_LENGTH; i++) {
      boardContainer.appendChild(this.createLine(i, digits));
    }

    this.setLargerBorders();
  }

  /**
  * Put matrix values into HTML board representation
  * @param matrix - Board Matrix 
  */
  putToHTML(matrix: GridNode[][]) {
    for (let i = 0; i < SIDE_LENGTH; i++) {
      for (let j = 0; j < SIDE_LENGTH; j++) {
        const id = i * SIDE_LENGTH + j;
        const node = document.getElementById(`square-${id}`);
        if (node) {
          node.innerText = Math.random() > 0.55 ? matrix[i][j].getValue()!.toString() : "";
          node.innerText === "" && matrix[i][j].setModifiable(true);
        }
      }
    }
  }

  /**
   * If a value was selected, remove squares with highlight background
   */
  clearNodesBackground() {
    for (let x = 0; x < SIDE_LENGTH * SIDE_LENGTH; x++) {
      document.getElementById(`square-${x}`)?.classList.remove("selected");
    }

    this.currentSelectedBtn = "";
  }

  // Disgusting atm -- TODO refactor    
  addSquareKeyboardListeners(matrix: GridNode[][]) {
    for (let i = 0; i < SIDE_LENGTH; i++) {
      for (let j = 0; j < SIDE_LENGTH; j++) {
        const node = document.getElementById(`square-${i * SIDE_LENGTH + j}`);
        if (matrix[i][j].isModifiable()) {
          node?.setAttribute("contenteditable", "true");
          node?.classList.add("modifiable");
          node?.addEventListener("keydown", (e) => {
            e.preventDefault();
            const isBackspace = e.key === "Backspace"
            const current = i * SIDE_LENGTH + j;
            if ((isNaN(Number(e.key)) && !isBackspace) || Number(e.key) === 0) {
              return;
            }
            // Overwrite & highlight
            node.innerText = e.key !== "Backspace" ? e.key : "";
            this.highlight(Number(e.key));

            if (!isBackspace) {
              node.classList.add("selected");
            } else {
              node.classList.remove("selected");
            }

            // Verify process
            if (!isBackspace && !SudokuValidator.prototype.isCorrect(Number(e.key), i, j, current)) {
              node.classList.add("wrong");
            } else {
              node.classList.remove("wrong");
            }

            // Recompute all false values

            // Is this the end?
            if (SudokuValidator.prototype.isGridEnd()) {
              this.removeNodeModificationOnWin();
              this.displayWinMessage();
            }
          })
        }
      }
    }
  };

  removeNodeModificationOnWin() {
    for (let i = 0; i < SIDE_LENGTH * SIDE_LENGTH; i++) {
      document.getElementById(`square-${i}`)?.removeAttribute("contenteditable");
    }
  }

  displayWinMessage() {
    const node = document.getElementById("end");
    if (node) node.innerText = "Bravo, vous avez gagné ! Cliquez sur Générer pour recommencer.";
  }

  removeWinMessage() {
    document.getElementById("end")!.innerHTML = "";
  }

  /**
   * Ability to highlight onclick
   */
  highlightSquaresOnClick() {
    for (let i = 0; i < 81; i++) {
      const square = document.getElementById(`square-${i}`)
      square?.addEventListener("click", (e) => {
        const value = Number((e as any).target?.innerText);
        this.highlight(value);
      })
    }
  }

  /**
   * Show squares holding given value
   * @param value 
   */
  highlight(value: number) {
    for (let i = 0; i < 81; i++) {
      const node = document.getElementById(`square-${i}`)
      const val = Number(node?.innerText);
      node?.classList.remove("selected");
      if (node?.innerText && val === value) node.classList.add("selected");
    }
  }

  /**
   * Erase user inputs on current grid
   * @param matrix 
   */
  eraseUserInputOnCurrentGrid(matrix: GridNode[][]) {
    for (let i = 0; i < SIDE_LENGTH; i++) {
      for (let j = 0; j < SIDE_LENGTH; j++) {
        if (matrix[i][j].isModifiable()) {
          this.eraseOneNodeInput(`square-${i * SIDE_LENGTH + j}`);
        }
      }
    }
  }



  /**
   * delete modifiable squares related CSS and conteneditable property
   */
  onNewGenerationClear() {
    for (let i = 0; i < SIDE_LENGTH; i++) {
      for (let j = 0; j < SIDE_LENGTH; j++) {
        const node = document.getElementById(`square-${i * SIDE_LENGTH + j}`);
        node?.removeAttribute("contenteditable");
        node?.classList.remove("modifiable", "wrong");
      }
    }
  }

  /**
   * Node erase user input
   * @param id 
   */
  private eraseOneNodeInput(id: string) {
    const node = document.getElementById(id);
    if (node) {
      node.innerText = "";
      node.classList.remove("selected", "wrong")
    }
  }

  /**
  * Board full line creation
  * @param div 
  * @param row 
  */
  private createLine(row: number, digits: DigitSelectors) {
    const div = document.createElement("div");
    div.setAttribute('id', `line-${row}`);
    div.setAttribute("class", "line");

    for (let col = 0; col < SIDE_LENGTH; col++) {
      div.appendChild(GridNode.prototype.createSingleSquare(row, col, digits));
    }

    return div;
  }

  /**
  * HTML Borders of main square and sub-squares
  */
  private setLargerBorders() {
    // Outer Borders
    this.generateMultipleSquaresBorder(0, 9, 1, "top");
    this.generateMultipleSquaresBorder(72, 81, 1, "bot");
    this.generateMultipleSquaresBorder(0, 73, 9, "left");
    this.generateMultipleSquaresBorder(8, 81, 9, "right");

    // Inner Borders
    this.generateMultipleSquaresBorder(18, 27, 1, "bot");
    this.generateMultipleSquaresBorder(45, 54, 1, "bot");
    this.generateMultipleSquaresBorder(3, 76, 9, "left");
    this.generateMultipleSquaresBorder(6, 79, 9, "left");
  }

  /**
   * Add CSS class for different nodes, dependending on the start/end/step combination
   * @param start - must be <= to end, else infinite loop
   * @param end 
   * @param step - for loop step
   * @param className 
  */
  private generateMultipleSquaresBorder(start: number, end: number, step: number, className: string) {
    for (let i = start; i < end; i += step) {
      document.getElementById(`square-${i}`)?.classList.add(className);
    }
  }
}