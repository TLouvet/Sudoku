"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SudokuHTMLHandler = void 0;
const constants_1 = require("../constants");
const DigitSelectors_1 = require("../DigitSelectors");
const GridNode_1 = require("../GridNode");
const Timer_1 = require("../Timer");
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
        document.querySelectorAll('.selected').forEach(e => e.classList.remove("selected"));
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
                        e.preventDefault();
                        const isBackspace = e.key === "Backspace";
                        const current = i * constants_1.SIDE_LENGTH + j;
                        // Valid entry
                        if ((isNaN(Number(e.key)) && !isBackspace) || Number(e.key) === 0) {
                            return;
                        }
                        const primitiveValue = node.innerText;
                        // Node value update
                        if (!isBackspace) {
                            node.innerText = e.key;
                            node.classList.add("selected");
                            this.highlight(Number(e.key));
                        }
                        else {
                            node.innerText = "";
                            node.classList.remove("selected");
                        }
                        // Verify process
                        if (!isBackspace && !SudokuValidator_1.SudokuValidator.prototype.isCorrect(Number(e.key), i, j, current)) {
                            node.classList.add("wrong");
                        }
                        else {
                            node.classList.remove("wrong");
                        }
                        DigitSelectors_1.DigitSelectors.checkBtnVisibility(isBackspace ? Number(primitiveValue) : Number(e.key));
                        SudokuValidator_1.SudokuValidator.recomputeWrongValues(current);
                        SudokuValidator_1.SudokuValidator.checkEndGame();
                    });
                }
            }
        }
    }
    ;
    static endGame() {
        document.querySelectorAll("[contenteditable='true']").forEach(e => e.removeAttribute("contenteditable"));
        Timer_1.Timer.stop();
        const node = document.getElementById("end");
        if (node)
            node.innerText = "Bravo, vous avez gagné ! Cliquez sur Générer pour recommencer.";
    }
    removeWinMessage() {
        document.getElementById("end").innerHTML = "";
    }
    /**
     * Ability to highlight onclick
     */
    highlightSquaresOnClick() {
        var _a;
        (_a = document.querySelectorAll('[id^="square-"]')) === null || _a === void 0 ? void 0 : _a.forEach(e => e.addEventListener("click", (evt) => {
            var _a;
            const value = Number((_a = evt.target) === null || _a === void 0 ? void 0 : _a.innerText);
            this.highlight(value);
        }));
    }
    /**
     * Show squares holding given value
     * @param value
     */
    highlight(value) {
        var _a, _b;
        (_a = document.querySelectorAll('.selected')) === null || _a === void 0 ? void 0 : _a.forEach(n => n.classList.remove("selected"));
        (_b = document.querySelectorAll('[id^="square-"]')) === null || _b === void 0 ? void 0 : _b.forEach(e => {
            const val = Number(e.innerText);
            if (val && val === value) {
                e.classList.add("selected");
            }
        });
    }
    /**
     * Erase user inputs on current grid
     * @param matrix
     */
    eraseUserInputOnCurrentGrid() {
        var _a;
        (_a = document.querySelectorAll('[contenteditable="true"]')) === null || _a === void 0 ? void 0 : _a.forEach(node => {
            node.classList.remove("selected", "wrong");
            node.innerText = "";
        });
    }
    /**
     * delete modifiable squares related CSS and conteneditable property in order to regenerate grid
     */
    eraseModifiableInput() {
        var _a;
        (_a = document.querySelectorAll('[contenteditable="true"]')) === null || _a === void 0 ? void 0 : _a.forEach(node => {
            node.removeAttribute("contenteditable");
            node.classList.remove("modifiable", "wrong");
            node.innerText = "";
        });
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
