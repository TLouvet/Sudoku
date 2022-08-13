"use strict";
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
const Sudoku_1 = require("./script/Sudoku");
const sudoku = new Sudoku_1.Sudoku();
bootstrap();
(_a = document.getElementById("generator")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", () => {
    sudoku.clearMatrix();
    sudoku.htmlHandler.clearNodesBackground();
    completeBoard();
});
(_b = document.getElementById("removeBack")) === null || _b === void 0 ? void 0 : _b.addEventListener("click", () => {
    sudoku.htmlHandler.clearNodesBackground();
});
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
        const square = document.getElementById(`square-${i}`);
        if (!square) {
            continue;
        }
        square.addEventListener("click", (e) => {
            var _a;
            const value = (_a = e.target) === null || _a === void 0 ? void 0 : _a.innerText;
            // Reinit nodes
            for (let x = 0; x < 81; x++) {
                const node = document.getElementById(`square-${x}`);
                node === null || node === void 0 ? void 0 : node.classList.remove("selected"); // Make it blank
                if ((node === null || node === void 0 ? void 0 : node.innerText) && node.innerText == value)
                    node === null || node === void 0 ? void 0 : node.classList.add("selected");
            }
        });
    }
}
