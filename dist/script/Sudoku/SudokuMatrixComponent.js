"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SudokuMatrixComponent = void 0;
const constants_1 = require("../constants");
const GridNode_1 = require("../GridNode");
const SudokuGeneratorUtils_1 = require("./SudokuGeneratorUtils");
/**
 * Representation of the code matrix used to generate the grid
 */
class SudokuMatrixComponent {
    constructor(matrix = []) {
        this.matrix = matrix;
        this.initiate();
    }
    /**
     * Initial matrix fill
     */
    initiate() {
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
    startFillProcess() {
        this.fill(this.matrix, 0, 0);
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
        const possibilities = SudokuGeneratorUtils_1.SudokuGeneratorUtils.prototype.getPossibleValuesForOneSquare(matrix, row, col);
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
        const colsend = SudokuGeneratorUtils_1.SudokuGeneratorUtils.prototype.getNextSquareCol(rowsend, col);
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
    /**
     * Reinitiate all of the squares and matrix values
     */
    clear() {
        for (let i = 0; i < constants_1.SIDE_LENGTH; i++) {
            for (let j = 0; j < constants_1.SIDE_LENGTH; j++) {
                this.matrix[i][j].reinitiate();
            }
        }
    }
}
exports.SudokuMatrixComponent = SudokuMatrixComponent;
