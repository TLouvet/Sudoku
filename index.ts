import { startSudokuHTMLHandlePerfTest } from "./script/PerfTest/SudokuHTMLHandlers";
import { SudokuBoard } from "./script/Sudoku";
import { getSameSolutionMatrix } from "./script/Sudoku/SudokuSolver";
import { Timer } from "./script/Timer";

const sudoku = new SudokuBoard();
let debug = false;

main();

// Generate new grid
document.getElementById("generator")?.addEventListener("click", () => {
  sudoku.onRegeneration();
  Timer.restart("timer");
});

// Unselect squares
document.getElementById("removeBack")?.addEventListener("click", () => {
  sudoku.clearBoard();
});

// Erase current user input for current grid but keep the grid
document.getElementById('restart')?.addEventListener("click", (e) => {

  sudoku.erase();
})

/**
 * Starter, creating the base HTML
 */
function main() {
  sudoku.onFirstCreation('sudoku-section');
  Timer.start("timer");
}

// TODO =>
// 1) Est-ce un vrai sudoku (1 solution) - pour l'instant les grilles peuvent avoir plus d'une solution, ce qui n'est pas optimal
// 2) Empêcher saisie d'une valeur si son bouton est hidden ?

// TESTS 
if (debug) {
  startSudokuHTMLHandlePerfTest();
}

