(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
const Sudoku_1 = require("./script/Sudoku");
const sudoku = new Sudoku_1.Sudoku();
bootstrap();
(_a = document.getElementById("generator")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", () => {
    sudoku.clearMatrix();
    sudoku.htmlHandler.clearNodesBackground();
    completeBoard();
});
(_b = document.getElementById("removeBack")) === null || _b === void 0 ? void 0 : _b.addEventListener("click", () => {
    sudoku.htmlHandler.clearNodesBackground();
});
/**
 * Starter, creating the base HTML
 */
function bootstrap() {
    sudoku.htmlHandler.createBoard("sudoku-section");
    completeBoard();
    listen();
    sudoku.htmlHandler.generateSelectors();
}
/**
 * Places matrix values into HTML Nodes
 */
function completeBoard() {
    sudoku.fill(sudoku.getMatrix(), 0, 0);
    sudoku.htmlHandler.putToHTML(sudoku.getMatrix());
    sudoku.addSquareListeners();
}
function listen() {
    for (let i = 0; i < 81; i++) {
        const square = document.getElementById(`square-${i}`);
        if (!square) {
            continue;
        }
        square.addEventListener("click", (e) => {
            var _a;
            const value = (_a = e.target) === null || _a === void 0 ? void 0 : _a.innerText;
            // Reinit nodes
            for (let x = 0; x < 81; x++) {
                const node = document.getElementById(`square-${x}`);
                node === null || node === void 0 ? void 0 : node.classList.remove("selected"); // Make it blank
                if ((node === null || node === void 0 ? void 0 : node.innerText) && node.innerText == value)
                    node === null || node === void 0 ? void 0 : node.classList.add("selected");
            }
        });
    }
}

},{"./script/Sudoku":3}],2:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GridNode = void 0;
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
    createSingleSquare(row, col, SIDE_LENGTH = 9) {
        const square = document.createElement("div");
        square.setAttribute("id", `square-${row * SIDE_LENGTH + col}`);
        square.setAttribute("class", "square");
        // Make selector buttons change depending on selection
        square.addEventListener("click", () => {
            for (let i = 0; i < SIDE_LENGTH; i++) {
                const btn = document.getElementById(`btn-selector-${i}`);
                btn === null || btn === void 0 ? void 0 : btn.classList.remove('btn-current');
                if ((btn === null || btn === void 0 ? void 0 : btn.innerText) === square.innerText) {
                    btn.classList.add('btn-current');
                }
            }
        });
        return square;
    }
}
exports.GridNode = GridNode;

},{}],3:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Sudoku = void 0;
const GridNode_1 = require("./GridNode");
const SudokuGenetorUtils_1 = require("./SudokuGenetorUtils");
const SudokuHTMLHandler_1 = require("./SudokuHTMLHandler");
class Sudoku {
    constructor(matrix = []) {
        this.matrix = matrix;
        this.SIDE_LENGTH = 9;
        this.utils = new SudokuGenetorUtils_1.SudokuGeneratorUtils();
        this.htmlHandler = new SudokuHTMLHandler_1.SudokuHTMLHandler(this.SIDE_LENGTH);
        for (let i = 0; i < this.SIDE_LENGTH; i++) {
            const arr = [];
            for (let j = 0; j < this.SIDE_LENGTH; j++) {
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
    /**
     * Reinitialize all of the values to null, in order to regenerate new version
     */
    clearMatrix() {
        for (let i = 0; i < this.SIDE_LENGTH; i++) {
            for (let j = 0; j < this.SIDE_LENGTH; j++) {
                const node = document.getElementById(`square-${i * this.SIDE_LENGTH + j}`);
                node === null || node === void 0 ? void 0 : node.removeAttribute("contenteditable");
                node === null || node === void 0 ? void 0 : node.classList.remove("modifiable");
                this.matrix[i][j].reinitiate();
            }
        }
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
        const possibilities = this.utils.getPossibleValuesForOneSquare(matrix, row, col);
        if (possibilities.length === 0) {
            return null;
        }
        // If we get to this specific point, then we have found a complete grid and need to quit as the for loop would reset to 0;
        if (row == this.SIDE_LENGTH - 1 && col == this.SIDE_LENGTH - 1) {
            matrix[row][col].setValue(possibilities[0]);
            return matrix;
        }
        // Shuffle Array of possibilities to generate multiple grids
        possibilities.sort(() => Math.random() > 0.5 ? 1 : -1);
        // ensure next does not go out of range
        const rowsend = row + 1 > this.SIDE_LENGTH - 1 ? 0 : row + 1;
        const colsend = this.utils.getNextSquareCol(rowsend, col);
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
    addSquareListeners() {
        for (let i = 0; i < this.SIDE_LENGTH; i++) {
            for (let j = 0; j < this.SIDE_LENGTH; j++) {
                const node = document.getElementById(`square-${i * this.SIDE_LENGTH + j}`);
                if (this.matrix[i][j].isModifiable()) {
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
                        this.htmlHandler.highlight(Number(e.key));
                        if (!isBackspace) {
                            node.classList.add("selected");
                        }
                        else {
                            node.classList.remove("selected");
                        }
                        // Buttons selectors update
                        for (let x = 0; x < 9; x++) {
                            const selector = document.getElementById(`btn-selector-${x}`);
                            selector === null || selector === void 0 ? void 0 : selector.classList.remove("btn-current");
                            if ((selector === null || selector === void 0 ? void 0 : selector.innerText) === String(e.key)) {
                                selector.classList.add("btn-current");
                            }
                        }
                        // Verify process
                        if (!isBackspace && !this.isCorrect(Number(e.key), i, j)) {
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
    isCorrect(value, row, col) {
        const firstRowIndex = row * this.SIDE_LENGTH;
        // Row 
        for (let i = firstRowIndex; i < firstRowIndex + this.SIDE_LENGTH; i++) {
            const node = document.getElementById(`square-${i}`);
            if ((node === null || node === void 0 ? void 0 : node.innerText) === String(value))
                return false;
        }
        // Column
        for (let j = col; j < 81; j += 9) {
            const node = document.getElementById(`square-${j}`);
            if ((node === null || node === void 0 ? void 0 : node.innerText) === String(value))
                return false;
        }
        // Sub square
        const { min: minR, max: maxR } = this.utils.getMinMaxPos(row);
        const { min: minC, max: maxC } = this.utils.getMinMaxPos(col);
        for (let x = minR; x < maxR; x++) {
            for (let y = minC; y < maxC; y++) {
                const node = document.getElementById(`square-${x * this.SIDE_LENGTH + y}`);
                if ((node === null || node === void 0 ? void 0 : node.innerText) === String(value))
                    return false;
            }
        }
        return true;
    }
}
exports.Sudoku = Sudoku;

},{"./GridNode":2,"./SudokuGenetorUtils":4,"./SudokuHTMLHandler":5}],4:[function(require,module,exports){
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

},{}],5:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SudokuHTMLHandler = void 0;
const GridNode_1 = require("./GridNode");
class SudokuHTMLHandler {
    constructor(SIDE_LENGTH = 9) {
        this.SIDE_LENGTH = SIDE_LENGTH;
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
        for (let i = 0; i < this.SIDE_LENGTH; i++) {
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
        for (let col = 0; col < this.SIDE_LENGTH; col++) {
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
        for (let i = 0; i < this.SIDE_LENGTH; i++) {
            for (let j = 0; j < this.SIDE_LENGTH; j++) {
                const id = i * this.SIDE_LENGTH + j;
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
        for (let x = 0; x < 81; x++) {
            const node = document.getElementById(`square-${x}`);
            if (node === null || node === void 0 ? void 0 : node.classList.contains("selected"))
                node.classList.remove("selected");
        }
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
}
exports.SudokuHTMLHandler = SudokuHTMLHandler;

},{"./GridNode":2}]},{},[1]);
