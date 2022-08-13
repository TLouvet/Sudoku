"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GridNode = void 0;
const constants_1 = require("./constants");
const Sudoku_1 = require("./Sudoku");
const SudokuHTMLHandler_1 = require("./SudokuHTMLHandler");
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
    createSingleSquare(row, col) {
        const square = document.createElement("div");
        square.setAttribute("id", `square-${row * constants_1.SIDE_LENGTH + col}`);
        square.setAttribute("class", "square");
        // Make selector buttons change depending on selection
        square.addEventListener("click", () => {
            if (square.innerText === '') {
                // square is empty
                if (!Sudoku_1.Sudoku.prototype.isCorrect(Number(SudokuHTMLHandler_1.SudokuHTMLHandler.currentSelectedBtn), row, col)) {
                    square.classList.add("wrong");
                }
                else {
                    square.classList.remove("wrong");
                }
                square.innerText = SudokuHTMLHandler_1.SudokuHTMLHandler.currentSelectedBtn;
            }
        });
        return square;
    }
}
exports.GridNode = GridNode;
