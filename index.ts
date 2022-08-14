import { startSudokuHTMLHandlePerfTest } from "./script/PerfTest/SudokuHTMLHandlers";
import { SudokuBoard } from "./script/Sudoku";
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
document.getElementById('removeOne')?.addEventListener("click", (e) => {
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
// 1) corriger bug où les valeurs ne sont pas recalculées => A chaque changement de valeur dans la grille, il faut recalculer les valeurs qui sont fausses
// 2) Victoire => Stoper le timer
// 3) Cosmétique: faire disparaitre les chiffres boutons lorsque 9 exemplaires existent

// TESTS 
if (debug) {
  startSudokuHTMLHandlePerfTest();
}

