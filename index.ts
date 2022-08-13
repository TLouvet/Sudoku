import { SIDE_LENGTH } from "./script/constants";
import { Sudoku } from "./script/Sudoku";
import { SudokuHTMLHandler } from "./script/SudokuHTMLHandler";

const sudoku = new Sudoku();
bootstrap();

document.getElementById("generator")?.addEventListener("click", () => {
  sudoku.clearMatrix();
  sudoku.htmlHandler.clearNodesBackground();
  completeBoard();
});

document.getElementById("removeBack")?.addEventListener("click", () => {
  sudoku.htmlHandler.clearNodesBackground();
});

document.getElementById('removeOne')?.addEventListener("click", (e) => {
  sudoku.erase();
  SudokuHTMLHandler.currentSelectedBtn = "";
  // remove btns selection
  for (let i = 0; i < SIDE_LENGTH * SIDE_LENGTH; i++) {
    document.getElementById(`square-${i}`)?.classList.remove("selected");
  }
})

/**
 * Starter, creating the base HTML
 */
function bootstrap() {
  sudoku.htmlHandler.createBoard("sudoku-section");
  completeBoard();
  listen();
  sudoku.htmlHandler.generateSelectors();
}

/**
 * Places matrix values into HTML Nodes
 */
function completeBoard() {
  sudoku.fill(sudoku.getMatrix(), 0, 0);
  sudoku.htmlHandler.putToHTML(sudoku.getMatrix());
  sudoku.addSquareListeners();
}

function listen() {
  for (let i = 0; i < 81; i++) {
    const square = document.getElementById(`square-${i}`)
    if (!square) {
      continue;
    }
    square.addEventListener("click", (e) => {
      const value = (e as any).target?.innerText;
      // Reinit nodes
      for (let x = 0; x < 81; x++) {
        const node = document.getElementById(`square-${x}`);
        node?.classList.remove("selected"); // Make it blank
        if (node?.innerText && node.innerText == value) node?.classList.add("selected");
      }
    })
  }
}





