"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GridNode = void 0;
const constants_1 = require("./constants");
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
        square.setAttribute("id", `square-${row * constants_1.SIDE_LENGTH + col}`);
        square.setAttribute("class", "square");
        square.addEventListener("click", () => {
            if (square.innerText === '') {
                const currentSelectedValue = digits.getCurrentSelectedID() + 1;
                if (!SudokuValidator_1.SudokuValidator.prototype.isCorrect(currentSelectedValue, row, col)) {
                    square.classList.add("wrong");
                }
                const valueToEnter = currentSelectedValue > 0 ? `${currentSelectedValue}` : '';
                square.innerText = valueToEnter;
            }
        });
        return square;
    }
}
exports.GridNode = GridNode;
