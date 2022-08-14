"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GridNode = void 0;
const constants_1 = require("./constants");
const DigitSelectors_1 = require("./DigitSelectors");
const SudokuValidator_1 = require("./Sudoku/SudokuValidator");
/**
 * Representation of a node
 */
class GridNode {
    constructor(value = null, canBeModified = false) {
        this.value = value;
        this.canBeModified = canBeModified;
    }
    /**
     * remove modification ability and resets value to null
     */
    reinitiate() {
        this.value = null;
        this.canBeModified = false;
    }
    isModifiable() {
        return this.canBeModified;
    }
    setModifiable(modif) {
        this.canBeModified = modif;
    }
    getValue() {
        return this.value;
    }
    setValue(value) {
        this.value = value;
    }
    /**
    * Node Generation for single square
    * @param row
    * @param col
    * @returns
    */
    createSingleSquare(row, col, digits) {
        const square = document.createElement("div");
        const currentId = row * constants_1.SIDE_LENGTH + col;
        square.setAttribute("id", `square-${currentId}`);
        square.setAttribute("class", "square");
        // Should probably be put into HTMLHandler at some point
        square.addEventListener("click", () => {
            if (square.innerText === '') {
                const currentSelectedValue = digits.getCurrentSelectedID() + 1;
                const valueToEnter = currentSelectedValue > 0 ? `${currentSelectedValue}` : '';
                square.innerText = valueToEnter;
                if (!SudokuValidator_1.SudokuValidator.prototype.isCorrect(currentSelectedValue, row, col, currentId)) {
                    square.classList.add("wrong");
                }
                DigitSelectors_1.DigitSelectors.checkBtnVisibility(Number(valueToEnter)); // should a button disappear
                SudokuValidator_1.SudokuValidator.recomputeWrongValues(currentId);
                SudokuValidator_1.SudokuValidator.checkEndGame();
            }
        });
        return square;
    }
}
exports.GridNode = GridNode;
