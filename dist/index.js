"use strict";
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", { value: true });
const Sudoku_1 = require("./script/Sudoku");
const Timer_1 = require("./script/Timer");
const sudoku = new Sudoku_1.SudokuBoard();
const timer = new Timer_1.Timer();
main();
// Generate new grid
(_a = document.getElementById("generator")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", () => {
    sudoku.onRegeneration();
    timer.restart("timer");
});
// Unselect squares
(_b = document.getElementById("removeBack")) === null || _b === void 0 ? void 0 : _b.addEventListener("click", () => {
    sudoku.clearBoard();
});
// Erase current user input for current grid but keep the grid
(_c = document.getElementById('removeOne')) === null || _c === void 0 ? void 0 : _c.addEventListener("click", (e) => {
    sudoku.erase();
});
/**
 * Starter, creating the base HTML
 */
function main() {
    sudoku.onFirstCreation('sudoku-section');
    timer.start("timer");
}
// TODO =>
// 1) corriger bug où les valeurs ne sont pas recalculées => A chaque changement de valeur dans la grille, il faut recalculer les valeurs qui sont fausses
// 2) Victoire => Stoper le timer
// 3) Cosmétique: faire disparaitre les chiffres boutons lorsque 9 exemplaires existent
