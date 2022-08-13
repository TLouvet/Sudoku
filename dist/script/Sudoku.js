"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Sudoku = void 0;
const constants_1 = require("./constants");
const GridNode_1 = require("./GridNode");
const SudokuGenetorUtils_1 = require("./SudokuGenetorUtils");
const SudokuHTMLHandler_1 = require("./SudokuHTMLHandler");
class Sudoku {
    constructor(matrix = []) {
        this.matrix = matrix;
        this.utils = new SudokuGenetorUtils_1.SudokuGeneratorUtils();
        this.htmlHandler = new SudokuHTMLHandler_1.SudokuHTMLHandler();
        for (let i = 0; i < constants_1.SIDE_LENGTH; i++) {
            const arr = [];
            for (let j = 0; j < constants_1.SIDE_LENGTH; j++) {
                arr.push(new GridNode_1.GridNode());
            }
            this.matrix.push(arr);
        }
    }
    /**
     * get the sudoku matrix
     * @returns any[][]
     */
    getMatrix() {
        return this.matrix;
    }
    /**
     * Reinitialize all of the values to null, in order to regenerate new version
     */
    clearMatrix() {
        for (let i = 0; i < constants_1.SIDE_LENGTH; i++) {
            for (let j = 0; j < constants_1.SIDE_LENGTH; j++) {
                const node = document.getElementById(`square-${i * constants_1.SIDE_LENGTH + j}`);
                node === null || node === void 0 ? void 0 : node.removeAttribute("contenteditable");
                node === null || node === void 0 ? void 0 : node.classList.remove("modifiable");
                node === null || node === void 0 ? void 0 : node.classList.remove("wrong");
                this.matrix[i][j].reinitiate();
            }
        }
    }
    /**
     * Recursively fill matrix and backtracks when no solution found
     * Fill Matrix column by column, from left to right, top to bottom
     * @param matrix
     * @param col
     * @param row
     * @returns
     */
    fill(matrix, col, row) {
        const possibilities = this.utils.getPossibleValuesForOneSquare(matrix, row, col);
        if (possibilities.length === 0) {
            return null;
        }
        // If we get to this specific point, then we have found a complete grid and need to quit as the for loop would reset to 0;
        if (row == constants_1.SIDE_LENGTH - 1 && col == constants_1.SIDE_LENGTH - 1) {
            matrix[row][col].setValue(possibilities[0]);
            return matrix;
        }
        // Shuffle Array of possibilities to generate multiple grids
        possibilities.sort(() => Math.random() > 0.5 ? 1 : -1);
        // ensure next does not go out of range
        const rowsend = row + 1 > constants_1.SIDE_LENGTH - 1 ? 0 : row + 1;
        const colsend = this.utils.getNextSquareCol(rowsend, col);
        for (let i = 0; i < possibilities.length; i++) {
            matrix[row][col].setValue(possibilities[i]);
            if (this.fill(matrix, colsend, rowsend)) {
                return matrix; // if we get here, then we have a potential valid solution for current square
            }
            ;
        }
        // No solution while following current path, let's backtrack
        matrix[row][col].setValue(null);
        return null;
    }
    // Disgusting atm -- TODO refactor    
    addSquareListeners() {
        for (let i = 0; i < constants_1.SIDE_LENGTH; i++) {
            for (let j = 0; j < constants_1.SIDE_LENGTH; j++) {
                const node = document.getElementById(`square-${i * constants_1.SIDE_LENGTH + j}`);
                if (this.matrix[i][j].isModifiable()) {
                    node === null || node === void 0 ? void 0 : node.setAttribute("contenteditable", "true");
                    node === null || node === void 0 ? void 0 : node.classList.add("modifiable");
                    node === null || node === void 0 ? void 0 : node.addEventListener("keydown", (e) => {
                        const isBackspace = e.key === "Backspace";
                        if ((isNaN(Number(e.key)) && !isBackspace) || Number(e.key) === 0) {
                            e.preventDefault();
                            return;
                        }
                        // Overwrite & highlight
                        node.innerText = "";
                        this.htmlHandler.highlight(Number(e.key));
                        if (!isBackspace) {
                            node.classList.add("selected");
                        }
                        else {
                            node.classList.remove("selected");
                        }
                        // Buttons selectors update
                        if (!isBackspace) {
                            for (let x = 0; x < 9; x++) {
                                const selector = document.getElementById(`btn-selector-${x}`);
                                selector === null || selector === void 0 ? void 0 : selector.classList.remove("btn-current");
                                if ((selector === null || selector === void 0 ? void 0 : selector.innerText) === String(e.key)) {
                                    selector.classList.add("btn-current");
                                }
                            }
                        }
                        // Verify process
                        if (!isBackspace && !this.isCorrect(Number(e.key), i, j)) {
                            node.classList.add("wrong");
                        }
                        else {
                            node.classList.remove("wrong");
                        }
                    });
                }
            }
        }
    }
    ;
    erase() {
        this.htmlHandler.erase(this.matrix);
    }
    isCorrect(value, row, col) {
        const firstRowIndex = row * constants_1.SIDE_LENGTH;
        // Row 
        for (let i = firstRowIndex; i < firstRowIndex + constants_1.SIDE_LENGTH; i++) {
            const node = document.getElementById(`square-${i}`);
            if ((node === null || node === void 0 ? void 0 : node.innerText) === String(value))
                return false;
        }
        // Column
        for (let j = col; j < 81; j += 9) {
            const node = document.getElementById(`square-${j}`);
            if ((node === null || node === void 0 ? void 0 : node.innerText) === String(value))
                return false;
        }
        // Sub square
        const { min: minR, max: maxR } = SudokuGenetorUtils_1.SudokuGeneratorUtils.prototype.getMinMaxPos(row);
        const { min: minC, max: maxC } = SudokuGenetorUtils_1.SudokuGeneratorUtils.prototype.getMinMaxPos(col);
        for (let x = minR; x < maxR; x++) {
            for (let y = minC; y < maxC; y++) {
                const node = document.getElementById(`square-${x * constants_1.SIDE_LENGTH + y}`);
                if ((node === null || node === void 0 ? void 0 : node.innerText) === String(value))
                    return false;
            }
        }
        return true;
    }
}
exports.Sudoku = Sudoku;
