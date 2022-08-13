"use strict";
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("./script/constants");
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
    var _a;
    sudoku.erase();
    // remove btns selection
    for (let i = 0; i < constants_1.SIDE_LENGTH * constants_1.SIDE_LENGTH; i++) {
        (_a = document.getElementById(`square-${i}`)) === null || _a === void 0 ? void 0 : _a.classList.remove("selected");
    }
});
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
        const square = document.getElementById(`square-${i}`); // Je trouve le oneud
        square === null || square === void 0 ? void 0 : square.addEventListener("click", (e) => {
            var _a;
            const value = (_a = e.target) === null || _a === void 0 ? void 0 : _a.innerText; // Je recup la valeur du noeud
            // je mets chaque noeud en blank puis je remets en selected. Sans un systeme de liste on ne fera pas mieux 
            for (let x = 0; x < 81; x++) {
                const node = document.getElementById(`square-${x}`);
                node === null || node === void 0 ? void 0 : node.classList.remove("selected"); // Make it blank
                if ((node === null || node === void 0 ? void 0 : node.innerText) && node.innerText == value)
                    node === null || node === void 0 ? void 0 : node.classList.add("selected");
            }
        });
    }
}
