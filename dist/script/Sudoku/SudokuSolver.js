"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSameSolutionMatrix = exports.SudokuSolver = void 0;
const constants_1 = require("../constants");
const GridNode_1 = require("../GridNode");
const SudokuGeneratorUtils_1 = require("./SudokuGeneratorUtils");
class SudokuSolver {
    /**
  * Recursively fill matrix and backtracks when no solution found
  * Fill Matrix column by column, from left to right, top to bottom
  * @param matrix
  * @param col
  * @param row
  * @returns
  */
    static fill(matrix, col, row) {
        // ensure next does not go out of range - in this version where we potentially skip, we want to have that first
        const rowsend = row + 1 > constants_1.SIDE_LENGTH - 1 ? 0 : row + 1;
        const colsend = SudokuGeneratorUtils_1.SudokuGeneratorUtils.prototype.getNextSquareCol(rowsend, col);
        const isModifiable = matrix[row][col].isModifiable();
        // This is the last one and number already exists
        if (SudokuSolver.isComplete(row, col) && !isModifiable) {
            return matrix;
        }
        else if (!isModifiable) {
            return SudokuSolver.fill(matrix, colsend, rowsend);
        }
        // No number exist on this square, thus we search
        const possibilities = SudokuGeneratorUtils_1.SudokuGeneratorUtils.prototype.getPossibleValuesForOneSquare(matrix, row, col);
        if (possibilities.length === 0) {
            return null;
        }
        // Last entry of the grid 
        if (SudokuSolver.isComplete(row, col)) {
            matrix[row][col].setValue(possibilities[0]);
            return matrix;
        }
        // This is the backtracking part
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
    static isComplete(row, col) {
        return row == constants_1.SIDE_LENGTH - 1 && col == constants_1.SIDE_LENGTH - 1;
    }
}
exports.SudokuSolver = SudokuSolver;
/**
 * Creates a matrix with missing values and tries to get back to the original one via an altered fill method.
 * The filling is not shuffled on the fill method for the verificator.
 * Does not guarantee a unique solution exists, but will definitely eliminate some grids in the process.
 * Downside is it seems to only work with high number placement
 * @param matrix
 */
function getSameSolutionMatrix(matrix) {
    // Create a copy with amputed numbers 
    let arr = [];
    let filled = null;
    while (!areSame(matrix, filled)) {
        arr = copyMainMatrix(matrix);
        const copyArr = makeCopyArr(arr);
        filled = SudokuSolver.fill(copyArr, 0, 0);
    }
    return arr;
}
exports.getSameSolutionMatrix = getSameSolutionMatrix;
// As we are working with objects & references, we make a hard copy to avoid modifying arr values 
function copyMainMatrix(matrix) {
    const arr = [];
    for (let i = 0; i < constants_1.SIDE_LENGTH; i++) {
        const temp = [];
        for (let j = 0; j < constants_1.SIDE_LENGTH; j++) {
            const val = matrix[i][j].getValue();
            const toPush = Math.random() > 0.60 ? val : null; // Here we change
            const modifiable = toPush === null;
            const gridnode = new GridNode_1.GridNode(toPush, modifiable);
            temp.push(gridnode);
        }
        arr.push(temp);
    }
    return arr;
}
// As we are working with objects & references, we make a hard copy to avoid modifying arr values 
function makeCopyArr(arr) {
    const copyArr = [];
    for (let i = 0; i < constants_1.SIDE_LENGTH; i++) {
        const temp = [];
        for (let j = 0; j < constants_1.SIDE_LENGTH; j++) {
            const val = arr[i][j].getValue();
            const modifiable = arr[i][j].isModifiable();
            const gridnode = new GridNode_1.GridNode(val, modifiable);
            temp.push(gridnode);
        }
        copyArr.push(temp);
    }
    return copyArr;
}
function areSame(arr1, arr2) {
    if (!arr2)
        return false;
    for (let i = 0; i < constants_1.SIDE_LENGTH; i++) {
        for (let j = 0; j < constants_1.SIDE_LENGTH; j++) {
            if (arr1[i][j].getValue() !== arr2[i][j].getValue())
                return false;
        }
    }
    return true;
}
