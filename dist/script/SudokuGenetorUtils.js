"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SudokuGeneratorUtils = void 0;
class SudokuGeneratorUtils {
    constructor(SIDE_LENGTH = 9) {
        this.SIDE_LENGTH = SIDE_LENGTH;
    }
    /**
     * Check which values could fit into current evaluated square
     * @param matrix
     * @param row
     * @param col
     * @returns
     */
    getPossibleValuesForOneSquare(matrix, row, col) {
        const possibilities = Array(this.SIDE_LENGTH).fill(0).map((_, i) => i + 1);
        const lineChecked = this.keepNonCommonOnLine(possibilities, matrix[row]);
        const columnChecked = this.keepNonCommonOnColumn(lineChecked, matrix, row, col);
        const allChecked = this.keepNonCommonOnSquare(columnChecked, matrix, row, col);
        return allChecked;
    }
    /**
     * While filling matrix, avoid column to go out of range
     * @param rowsend
     * @param col
     * @returns
     */
    getNextSquareCol(rowsend, col) {
        if (rowsend != 0)
            return col;
        if (col + 1 > this.SIDE_LENGTH - 1)
            return 0;
        return col + 1;
    }
    /** sudoku line validation */
    keepNonCommonOnLine(possibles, line) {
        // d'abord récupérer les valeurs 
        const values = line.map(e => e.getValue());
        return possibles && possibles.filter(e => !values.includes(e));
    }
    /** Column validation */
    keepNonCommonOnColumn(possibilities, matrix, row, col) {
        const arr = [];
        for (let i = 0; i < row; i++) {
            const val = matrix[i][col].getValue();
            if (val && possibilities.includes(val))
                arr.push(val);
        }
        return possibilities.filter(e => !arr.includes(e));
    }
    /**Sudoku sub-square validation*/
    keepNonCommonOnSquare(possibilities, matrix, row, col) {
        const arr = [];
        const { min: minR, max: maxR } = this.getMinMaxPos(row);
        const { min: minC, max: maxC } = this.getMinMaxPos(col);
        for (let row = minR; row < maxR; row++) {
            for (let col = minC; col < maxC; col++) {
                const val = matrix[row][col].getValue();
                if (val && possibilities.includes(val))
                    arr.push(val);
            }
        }
        return possibilities.filter(e => !arr.includes(e));
    }
    /**
   * Find which indexes will be checked when verifying a sudoku sub-square
   * @param arg
   * @returns
   */
    getMinMaxPos(arg) {
        let min = 0;
        let max = 3;
        if (arg >= 3 && arg < 6) {
            min = 3;
            max = 6;
        }
        else if (arg >= 6) {
            min = 6;
            max = 9;
        }
        return { min, max };
    }
}
exports.SudokuGeneratorUtils = SudokuGeneratorUtils;
