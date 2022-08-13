"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SudokuValidator = void 0;
const constants_1 = require("../constants");
const SudokuGeneratorUtils_1 = require("./SudokuGeneratorUtils");
class SudokuValidator {
    /**
     * Checks for an entry if it does not conflict with already known information
     * @param value
     * @param row
     * @param col
     * @returns
     */
    isCorrect(value, row, col, current) {
        const firstRowIndex = row * constants_1.SIDE_LENGTH;
        // Row 
        for (let i = firstRowIndex; i < firstRowIndex + constants_1.SIDE_LENGTH; i++) {
            if (i === current)
                continue;
            const node = document.getElementById(`square-${i}`);
            if ((node === null || node === void 0 ? void 0 : node.innerText) === String(value))
                return false;
        }
        // Column
        for (let j = col; j < 81; j += 9) {
            if (j === current)
                continue;
            const node = document.getElementById(`square-${j}`);
            if ((node === null || node === void 0 ? void 0 : node.innerText) === String(value))
                return false;
        }
        // Sub square
        const { min: minR, max: maxR } = SudokuGeneratorUtils_1.SudokuGeneratorUtils.prototype.getMinMaxPos(row);
        const { min: minC, max: maxC } = SudokuGeneratorUtils_1.SudokuGeneratorUtils.prototype.getMinMaxPos(col);
        for (let x = minR; x < maxR; x++) {
            for (let y = minC; y < maxC; y++) {
                if (x * constants_1.SIDE_LENGTH + y === current)
                    continue;
                const node = document.getElementById(`square-${x * constants_1.SIDE_LENGTH + y}`);
                if ((node === null || node === void 0 ? void 0 : node.innerText) === String(value))
                    return false;
            }
        }
        return true;
    }
    /**
     * If the whole grid is filled with no error, it's the end
     * @returns
     */
    isGridEnd() {
        for (let i = 0; i < constants_1.SIDE_LENGTH * constants_1.SIDE_LENGTH; i++) {
            const node = document.getElementById(`square-${i}`);
            if ((node === null || node === void 0 ? void 0 : node.innerHTML) == '' || (node === null || node === void 0 ? void 0 : node.classList.contains("wrong"))) {
                return false;
            }
        }
        return true;
    }
}
exports.SudokuValidator = SudokuValidator;
