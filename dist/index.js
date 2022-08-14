"use strict";
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", { value: true });
const SudokuHTMLHandlers_1 = require("./script/PerfTest/SudokuHTMLHandlers");
const Sudoku_1 = require("./script/Sudoku");
const Timer_1 = require("./script/Timer");
const sudoku = new Sudoku_1.SudokuBoard();
let debug = false;
main();
// Generate new grid
(_a = document.getElementById("generator")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", () => {
    sudoku.onRegeneration();
    Timer_1.Timer.restart("timer");
});
// Unselect squares
(_b = document.getElementById("removeBack")) === null || _b === void 0 ? void 0 : _b.addEventListener("click", () => {
    sudoku.clearBoard();
});
// Erase current user input for current grid but keep the grid
(_c = document.getElementById('restart')) === null || _c === void 0 ? void 0 : _c.addEventListener("click", (e) => {
    sudoku.erase();
});
/**
 * Starter, creating the base HTML
 */
function main() {
    sudoku.onFirstCreation('sudoku-section');
    Timer_1.Timer.start("timer");
}
// TODO =>
// 2) Est-ce un vrai sudoku (1 solution) - pour l'instant les grilles peuvent avoir plus d'une solution, ce qui n'est pas optimal
// TESTS 
if (debug) {
    (0, SudokuHTMLHandlers_1.startSudokuHTMLHandlePerfTest)();
}
