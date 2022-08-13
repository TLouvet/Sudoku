"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SudokuHTMLHandler = void 0;
const constants_1 = require("./constants");
const GridNode_1 = require("./GridNode");
class SudokuHTMLHandler {
    constructor() { }
    getCurrentSelectedValue() {
        return SudokuHTMLHandler.currentSelectedBtn;
    }
    /**
     *HTML CSS MATRIX creation -- generates only the squares, not the content
     *@param {string} - id -- Tag ID to add board node
     */
    createBoard(id) {
        const boardContainer = document.getElementById(id);
        if (!boardContainer) {
            throw new Error("Aucun élément n'existe avec l'id donné");
        }
        for (let i = 0; i < constants_1.SIDE_LENGTH; i++) {
            boardContainer.appendChild(this.createLine(i));
        }
        this.setLargerBorders();
    }
    /**
     * Board full line creation
     * @param div
     * @param row
     */
    createLine(row) {
        const div = document.createElement("div");
        div.setAttribute('id', `line-${row}`);
        div.setAttribute("class", "line");
        for (let col = 0; col < constants_1.SIDE_LENGTH; col++) {
            div.appendChild(GridNode_1.GridNode.prototype.createSingleSquare(row, col));
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
    generateMultipleSquaresBorder(start, end, step, className) {
        if (start > end) {
            return;
        }
        for (let i = start; i < end; i += step) {
            const div = document.getElementById(`square-${i}`);
            div === null || div === void 0 ? void 0 : div.classList.add(className);
        }
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
                    node.innerText = Math.random() > 0.55 ? matrix[i][j].getValue().toString() : ""; // Quand on enlève ici il faut aussi modif la matrix du coup
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
            const node = document.getElementById(`square-${x}`);
            if (node === null || node === void 0 ? void 0 : node.classList.contains("selected"))
                node.classList.remove("selected");
        }
        for (let i = 0; i < 9; i++) {
            const btn = (_a = document.getElementById(`btn-selector-${i}`)) === null || _a === void 0 ? void 0 : _a.classList.remove("btn-current");
        }
        SudokuHTMLHandler.currentSelectedBtn = "";
    }
    generateSelectors() {
        const parent = document.getElementById("selectors");
        for (let i = 0; i < 9; i++) {
            const btn = document.createElement("button");
            btn.setAttribute("id", `btn-selector-${i}`);
            btn.setAttribute("class", "btn ml-10");
            btn.innerText = `${i + 1}`;
            btn.addEventListener("click", () => {
                var _a;
                this.highlight(i + 1);
                for (let j = 0; j < 9; j++) {
                    (_a = document.getElementById(`btn-selector-${j}`)) === null || _a === void 0 ? void 0 : _a.classList.remove("btn-current");
                }
                btn.classList.add("btn-current");
                SudokuHTMLHandler.currentSelectedBtn = btn.innerText;
            });
            parent === null || parent === void 0 ? void 0 : parent.appendChild(btn);
        }
    }
    highlight(value) {
        for (let i = 0; i < 81; i++) {
            const node = document.getElementById(`square-${i}`);
            const isInput = (node === null || node === void 0 ? void 0 : node.tagName) === "INPUT";
            const val = isInput ? node.value : Number(node === null || node === void 0 ? void 0 : node.innerText);
            node === null || node === void 0 ? void 0 : node.classList.remove("selected");
            if ((node === null || node === void 0 ? void 0 : node.innerText) && val === value)
                node.classList.add("selected");
        }
    }
    erase(matrix) {
        for (let i = 0; i < constants_1.SIDE_LENGTH; i++) {
            const btn = document.getElementById(`btn-selector-${i}`);
            btn === null || btn === void 0 ? void 0 : btn.classList.remove('btn-current');
            // Effacer aussi les cases sélectionnées
            for (let j = 0; j < constants_1.SIDE_LENGTH; j++) {
                if (matrix[i][j].isModifiable()) {
                    const node = document.getElementById(`square-${i * constants_1.SIDE_LENGTH + j}`);
                    if (node) {
                        node.innerText = "";
                        node.classList.remove("selected", "wrong");
                    }
                }
            }
        }
    }
}
exports.SudokuHTMLHandler = SudokuHTMLHandler;
SudokuHTMLHandler.currentSelectedBtn = "";
