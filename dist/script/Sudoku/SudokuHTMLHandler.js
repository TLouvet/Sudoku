"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SudokuHTMLHandler = void 0;
const constants_1 = require("../constants");
const GridNode_1 = require("../GridNode");
const SudokuValidator_1 = require("./SudokuValidator");
class SudokuHTMLHandler {
    constructor() {
        this.currentSelectedBtn = "";
    }
    getCurrentSelectedValue() {
        return this.currentSelectedBtn;
    }
    setCurrentSelectedValue(val) {
        this.currentSelectedBtn = val;
    }
    /**
     *Html/css matrix representation initial creation -- generates only the squares, not the content
     *@param {string} - id -- Tag ID to add board node
     */
    createBoard(id, digits) {
        const boardContainer = document.getElementById(id);
        if (!boardContainer) {
            throw new Error("Aucun élément n'existe avec l'id donné");
        }
        for (let i = 0; i < constants_1.SIDE_LENGTH; i++) {
            boardContainer.appendChild(this.createLine(i, digits));
        }
        this.setLargerBorders();
    }
    /**
    * Put matrix values into HTML board representation
    * @param matrix - Board Matrix
    */
    putToHTML(matrix) {
        for (let i = 0; i < constants_1.SIDE_LENGTH; i++) {
            for (let j = 0; j < constants_1.SIDE_LENGTH; j++) {
                const id = i * constants_1.SIDE_LENGTH + j;
                const node = document.getElementById(`square-${id}`);
                if (node) {
                    node.innerText = Math.random() > 0.55 ? matrix[i][j].getValue().toString() : "";
                    node.innerText === "" && matrix[i][j].setModifiable(true);
                }
            }
        }
    }
    /**
     * If a value was selected, remove squares with highlight background
     */
    clearNodesBackground() {
        var _a;
        for (let x = 0; x < 81; x++) {
            (_a = document.getElementById(`square-${x}`)) === null || _a === void 0 ? void 0 : _a.classList.remove("selected");
        }
        this.currentSelectedBtn = "";
    }
    // Disgusting atm -- TODO refactor    
    addSquareKeyboardListeners(matrix) {
        for (let i = 0; i < constants_1.SIDE_LENGTH; i++) {
            for (let j = 0; j < constants_1.SIDE_LENGTH; j++) {
                const node = document.getElementById(`square-${i * constants_1.SIDE_LENGTH + j}`);
                if (matrix[i][j].isModifiable()) {
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
                        this.highlight(Number(e.key));
                        if (!isBackspace) {
                            node.classList.add("selected");
                        }
                        else {
                            node.classList.remove("selected");
                        }
                        // Verify process
                        if (!isBackspace && !SudokuValidator_1.SudokuValidator.prototype.isCorrect(Number(e.key), i, j)) {
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
    /**
     * Show squares holding given value
     * @param value
     */
    highlight(value) {
        for (let i = 0; i < 81; i++) {
            const node = document.getElementById(`square-${i}`);
            const val = Number(node === null || node === void 0 ? void 0 : node.innerText);
            node === null || node === void 0 ? void 0 : node.classList.remove("selected");
            if ((node === null || node === void 0 ? void 0 : node.innerText) && val === value)
                node.classList.add("selected");
        }
    }
    /**
     * Erase user inputs on current grid
     * @param matrix
     */
    eraseUserInputOnCurrentGrid(matrix) {
        for (let i = 0; i < constants_1.SIDE_LENGTH; i++) {
            for (let j = 0; j < constants_1.SIDE_LENGTH; j++) {
                if (matrix[i][j].isModifiable()) {
                    this.eraseOneNodeInput(`square-${i * constants_1.SIDE_LENGTH + j}`);
                }
            }
        }
    }
    eraseOneNodeInput(id) {
        const node = document.getElementById(id);
        if (node) {
            node.innerText = "";
            node.classList.remove("selected", "wrong");
        }
    }
    /**
     * delete modifiable squares related CSS and conteneditable property
     */
    onNewGenerationClear() {
        for (let i = 0; i < constants_1.SIDE_LENGTH; i++) {
            for (let j = 0; j < constants_1.SIDE_LENGTH; j++) {
                const node = document.getElementById(`square-${i * constants_1.SIDE_LENGTH + j}`);
                node === null || node === void 0 ? void 0 : node.removeAttribute("contenteditable");
                node === null || node === void 0 ? void 0 : node.classList.remove("modifiable", "wrong");
            }
        }
    }
    /**
    * Board full line creation
    * @param div
    * @param row
    */
    createLine(row, digits) {
        const div = document.createElement("div");
        div.setAttribute('id', `line-${row}`);
        div.setAttribute("class", "line");
        for (let col = 0; col < constants_1.SIDE_LENGTH; col++) {
            div.appendChild(GridNode_1.GridNode.prototype.createSingleSquare(row, col, digits));
        }
        return div;
    }
    /**
    * HTML Borders of main square and sub-squares
    */
    setLargerBorders() {
        // Outer Borders
        this.generateMultipleSquaresBorder(0, 9, 1, "top");
        this.generateMultipleSquaresBorder(72, 81, 1, "bot");
        this.generateMultipleSquaresBorder(0, 73, 9, "left");
        this.generateMultipleSquaresBorder(8, 81, 9, "right");
        // Inner Borders
        this.generateMultipleSquaresBorder(18, 27, 1, "bot");
        this.generateMultipleSquaresBorder(45, 54, 1, "bot");
        this.generateMultipleSquaresBorder(3, 76, 9, "left");
        this.generateMultipleSquaresBorder(6, 79, 9, "left");
    }
    /**
     * Add CSS class for different nodes, dependending on the start/end/step combination
     * @param start - must be <= to end, else infinite loop
     * @param end
     * @param step - for loop step
     * @param className
    */
    generateMultipleSquaresBorder(start, end, step, className) {
        var _a;
        for (let i = start; i < end; i += step) {
            (_a = document.getElementById(`square-${i}`)) === null || _a === void 0 ? void 0 : _a.classList.add(className);
        }
    }
}
exports.SudokuHTMLHandler = SudokuHTMLHandler;
