import { SIDE_LENGTH } from "../constants";
import { DigitSelectors } from "../DigitSelectors";
import { GridNode } from "../GridNode";
import { Timer } from "../Timer";
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
    boardContainer.replaceChildren(); // Eliminate loader

    for (let i = 0; i < SIDE_LENGTH; i++) {
      boardContainer.appendChild(this.createLine(i, digits));
    }

    this.setLargerBorders();
  }

  static createLoader() {
    document.getElementById('sudoku-section')!.replaceChildren();
    const loader = document.createElement('div');
    loader.classList.add('rotator');
    document.getElementById('sudoku-section')?.appendChild(loader);
  }

  /**
  * Put matrix values into HTML board representation and decide which ones are shown
  * @param matrix - Board Matrix 
  */
  putToHTML(unfilledMatrix: GridNode[][], matrixComponent: GridNode[][]) {
    for (let i = 0; i < SIDE_LENGTH; i++) {
      for (let j = 0; j < SIDE_LENGTH; j++) {
        const id = i * SIDE_LENGTH + j;
        const node = document.getElementById(`square-${id}`);
        if (node) {
          node.innerText = unfilledMatrix[i][j].getValue()?.toString() || '';
          node.innerText === "" && matrixComponent[i][j].setModifiable(true);
        }
      }
    }
  }

  /**
   * If a value was selected, remove squares with highlight background
   */
  clearNodesBackground() {
    document.querySelectorAll('.selected').forEach(e => e.classList.remove("selected"));
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
            // Valid entry
            if ((isNaN(Number(e.key)) && !isBackspace) || Number(e.key) === 0) {
              return;
            }

            const primitiveValue = node.innerText;
            // Node value update
            if (!isBackspace) {
              node.innerText = e.key;
              node.classList.add("selected");
              this.highlight(Number(e.key));
            } else {
              node.innerText = "";
              node.classList.remove("selected");
            }

            // Verify process
            if (!isBackspace && !SudokuValidator.prototype.isCorrect(Number(e.key), i, j, current)) {
              node.classList.add("wrong");
            } else {
              node.classList.remove("wrong");
            }

            DigitSelectors.checkBtnVisibility(isBackspace ? Number(primitiveValue) : Number(e.key));
            SudokuValidator.recomputeWrongValues(current);
            SudokuValidator.checkEndGame();
          })
        }
      }
    }
  };

  static endGame() {
    document.querySelectorAll("[contenteditable='true']").forEach(e => e.removeAttribute("contenteditable"));
    Timer.stop();
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
    document.querySelectorAll('[id^="square-"]')?.forEach(e => e.addEventListener("click", (evt) => {
      const value = Number((evt as any).target?.innerText);
      this.highlight(value);
    }));
  }

  /**
   * Show squares holding given value
   * @param value 
   */
  highlight(value: number) {
    document.querySelectorAll('.selected')?.forEach(n => n.classList.remove("selected"));
    document.querySelectorAll('[id^="square-"]')?.forEach(e => {
      const val = Number((e as HTMLElement).innerText);
      if (val && val === value) {
        e.classList.add("selected");
      }
    })
  }

  /**
   * Erase user inputs on current grid
   * @param matrix 
   */
  eraseUserInputOnCurrentGrid() {
    document.querySelectorAll('[contenteditable="true"]')?.forEach(node => {
      node.classList.remove("selected", "wrong");
      (node as HTMLElement).innerText = "";
    })
  }

  /**
   * delete modifiable squares related CSS and conteneditable property in order to regenerate grid
   */
  eraseModifiableInput() {
    document.querySelectorAll('[contenteditable="true"]')?.forEach(node => {
      node.removeAttribute("contenteditable");
      node.classList.remove("modifiable", "wrong");
      (node as HTMLElement).innerText = "";
    })
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