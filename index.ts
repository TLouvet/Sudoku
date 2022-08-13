import { SIDE_LENGTH } from "./script/constants";
import { SudokuBoard } from "./script/Sudoku";
import { Timer } from "./script/Timer";

const sudoku = new SudokuBoard();
const timer = new Timer();

main();

// Generate new grid
document.getElementById("generator")?.addEventListener("click", () => {
  sudoku.onRegeneration();
  timer.restart("timer");
});

// Unselect squares
document.getElementById("removeBack")?.addEventListener("click", () => {
  sudoku.clearBoard();
});

// Erase current user input for current grid but keep the grid
document.getElementById('removeOne')?.addEventListener("click", (e) => {
  sudoku.erase();
  // remove btns selection
  for (let i = 0; i < SIDE_LENGTH * SIDE_LENGTH; i++) {
    document.getElementById(`square-${i}`)?.classList.remove("selected");
  }
})

/**
 * Starter, creating the base HTML
 */
function main() {
  sudoku.onFirstCreation('sudoku-section');
  listen();
  timer.start("timer");
}

// Doit être déplacée dans SudokuHTMLHandlers
function listen() {
  for (let i = 0; i < 81; i++) { // Pour chaque noeud
    const square = document.getElementById(`square-${i}`) // Je trouve le oneud
    square?.addEventListener("click", (e) => { // J'add listener on click
      const value = (e as any).target?.innerText; // Je recup la valeur du noeud
      // je mets chaque noeud en blank puis je remets en selected. Sans un systeme de liste on ne fera pas mieux 
      for (let x = 0; x < 81; x++) {
        const node = document.getElementById(`square-${x}`);
        node?.classList.remove("selected"); // Make it blank
        if (node?.innerText && node.innerText == value) node?.classList.add("selected");
      }
    })
  }
}





