(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", { value: true });
const SudokuHTMLHandlers_1 = require("./script/PerfTest/SudokuHTMLHandlers");
const Sudoku_1 = require("./script/Sudoku");
const Timer_1 = require("./script/Timer");
const sudoku = new Sudoku_1.SudokuBoard();
let debug = false;
main();
// Generate new grid
(_a = document.getElementById("generator")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", () => {
    sudoku.onRegeneration();
    Timer_1.Timer.restart("timer");
});
// Unselect squares
(_b = document.getElementById("removeBack")) === null || _b === void 0 ? void 0 : _b.addEventListener("click", () => {
    sudoku.clearBoard();
});
// Erase current user input for current grid but keep the grid
(_c = document.getElementById('restart')) === null || _c === void 0 ? void 0 : _c.addEventListener("click", (e) => {
    sudoku.erase();
});
/**
 * Starter, creating the base HTML
 */
function main() {
    sudoku.onFirstCreation('sudoku-section');
    Timer_1.Timer.start("timer");
}
// TODO =>
// 1) Est-ce un vrai sudoku (1 solution) - pour l'instant les grilles peuvent avoir plus d'une solution, ce qui n'est pas optimal
// 2) Empêcher saisie d'une valeur si son bouton est hidden ?
// TESTS 
if (debug) {
    (0, SudokuHTMLHandlers_1.startSudokuHTMLHandlePerfTest)();
}

},{"./script/PerfTest/SudokuHTMLHandlers":4,"./script/Sudoku":5,"./script/Timer":12}],2:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DigitSelectors = void 0;
/**
 * DgitiSelectors.ts
 * These buttons allow the user to see which squares hold their values.
 * On click on one digit, its value becomes the one used to fill empty squares by default
 */
const SudokuHTMLHandler_1 = require("./SudokuHTMLHandler");
class DigitSelectors {
    constructor() {
        this.currentSelected = -1;
    }
    getCurrentSelectedID() {
        return this.currentSelected;
    }
    //Creation 
    generate() {
        const parent = document.getElementById("selectors");
        if (parent) {
            parent.replaceChildren();
        }
        for (let i = 0; i < 9; i++) {
            const btn = document.createElement("button");
            btn.setAttribute("id", `btn-selector-${i}`);
            btn.setAttribute("class", "btn ml-10");
            btn.innerText = `${i + 1}`;
            this.setListener(btn, i);
            parent === null || parent === void 0 ? void 0 : parent.appendChild(btn);
        }
    }
    setListener(node, id) {
        node.addEventListener("click", () => {
            SudokuHTMLHandler_1.SudokuHTMLHandler.prototype.highlight(id + 1);
            this.makeNewCurrent(id, node);
        });
    }
    removeHTML() {
        document.getElementById("selectors").replaceChildren();
    }
    // Current btn operations
    unselect() {
        var _a;
        (_a = document.getElementById(`btn-selector-${this.currentSelected}`)) === null || _a === void 0 ? void 0 : _a.classList.remove("btn-current");
        this.currentSelected = -1;
    }
    /** */
    static checkBtnVisibility(value) {
        var _a;
        if (value === 0)
            return;
        let counter = 0;
        const index = value - 1;
        (_a = document.querySelectorAll('[id^=square-')) === null || _a === void 0 ? void 0 : _a.forEach(node => counter += Number(node.innerText) === value ? 1 : 0);
        if (counter >= 9) {
            document.getElementById(`btn-selector-${index}`).style.visibility = "hidden";
        }
        else {
            document.getElementById(`btn-selector-${index}`).style.visibility = "unset";
        }
    }
    /**
     * Make clicked button the vue selector + default filling option
     * @param htmlIdNbr
     * @param btn
     */
    makeNewCurrent(htmlIdNbr, btn) {
        this.unselect();
        this.currentSelected = htmlIdNbr;
        btn.classList.add("btn-current");
    }
}
exports.DigitSelectors = DigitSelectors;

},{"./SudokuHTMLHandler":6}],3:[function(require,module,exports){
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

},{"./DigitSelectors":2,"./Sudoku/SudokuValidator":11,"./constants":13}],4:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.startSudokuHTMLHandlePerfTest = void 0;
const constants_1 = require("../constants");
const test_1 = require("../test");
////////// Remove node modification
// 20ms -- 10k tries Faster
function removeNodeModificationOnWinQS() {
    var _a;
    (_a = document.querySelectorAll("[contenteditable='true']")) === null || _a === void 0 ? void 0 : _a.forEach(e => e.removeAttribute("contenteditable"));
}
// 80ms -- 10k tries Slower
function removeNodeModificationOnWinWholeLoop() {
    var _a;
    for (let i = 0; i < constants_1.SIDE_LENGTH * constants_1.SIDE_LENGTH; i++) {
        (_a = document.getElementById(`square-${i}`)) === null || _a === void 0 ? void 0 : _a.removeAttribute("contenteditable");
    }
}
/////////// HighlightSquares
// 2650ms for 1k iter -- SLOW
function highlightSquaresOnClickLoop() {
    for (let i = 0; i < 81; i++) {
        const square = document.getElementById(`square-${i}`);
        square === null || square === void 0 ? void 0 : square.addEventListener("click", (e) => {
            var _a;
            const value = Number((_a = e.target) === null || _a === void 0 ? void 0 : _a.innerText);
            highlightQS(value);
            //highlightLoop(value);
        });
    }
}
// 500ms for 1k iter -- Faster
function highlightSquaresOnClickQS() {
    var _a;
    (_a = document.querySelectorAll('[id^="square-"]')) === null || _a === void 0 ? void 0 : _a.forEach(e => e.addEventListener("click", (evt) => {
        var _a;
        const value = Number((_a = evt.target) === null || _a === void 0 ? void 0 : _a.innerText);
        //highlightQS(value);
        highlightLoop(value);
    }));
}
////// Highlight function -- both have same speed given that both highlight caller perform the same with each.
function highlightQS(value) {
    var _a, _b;
    (_a = document.querySelectorAll('.selected')) === null || _a === void 0 ? void 0 : _a.forEach(n => n.classList.remove("selected"));
    (_b = document.querySelectorAll('[id^="square-"]')) === null || _b === void 0 ? void 0 : _b.forEach(e => {
        const val = Number(e.innerText);
        if (val && val === value) {
            e.classList.add("selected");
        }
    });
}
function highlightLoop(value) {
    for (let i = 0; i < 81; i++) {
        const node = document.getElementById(`square-${i}`);
        const val = Number(node === null || node === void 0 ? void 0 : node.innerText);
        node === null || node === void 0 ? void 0 : node.classList.remove("selected");
        if ((node === null || node === void 0 ? void 0 : node.innerText) && val === value)
            node.classList.add("selected");
    }
}
//// Board Regeneration
//50ms - 1k 
function onNewGenerationClearLoop() {
    for (let i = 0; i < constants_1.SIDE_LENGTH; i++) {
        for (let j = 0; j < constants_1.SIDE_LENGTH; j++) {
            const node = document.getElementById(`square-${i * constants_1.SIDE_LENGTH + j}`);
            node === null || node === void 0 ? void 0 : node.removeAttribute("contenteditable");
            node === null || node === void 0 ? void 0 : node.classList.remove("modifiable", "wrong");
        }
    }
}
// 2ms - 1k
function onNewGenerationClearQS() {
    var _a;
    (_a = document.querySelectorAll('[contenteditable="true]')) === null || _a === void 0 ? void 0 : _a.forEach(node => {
        node.removeAttribute("contenteditable");
        node.classList.remove("modifiable", "wrong");
    });
}
function startSudokuHTMLHandlePerfTest() {
    console.log(`Remove Node Modification with HTML List of contenteditable: ${(0, test_1.testPerformance)(removeNodeModificationOnWinQS)} milliseconds on 10k iterations`);
    console.log(`Remove Node Modification with for loop on every square: ${(0, test_1.testPerformance)(removeNodeModificationOnWinWholeLoop)} milliseconds on 10k iterations`);
    console.log(`Testing Highlight caller function - HTML LIST: ${(0, test_1.testPerformance)(highlightSquaresOnClickLoop, 1000)}ms on 1k iterations`);
    console.log(`Testing Highlight caller function - Loop: ${(0, test_1.testPerformance)(highlightSquaresOnClickQS, 1000)}ms on 1k iterations`);
    console.log(`Testing remove modifiable inputs - HTML LIST: ${(0, test_1.testPerformance)(onNewGenerationClearQS, 1000)}ms on 1k iterations`);
    console.log(`Testing remove modifiable inputs - Loop: ${(0, test_1.testPerformance)(onNewGenerationClearLoop, 1000)}ms on 1k iterations`);
}
exports.startSudokuHTMLHandlePerfTest = startSudokuHTMLHandlePerfTest;

},{"../constants":13,"../test":14}],5:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SudokuBoard = void 0;
const DigitSelectors_1 = require("./DigitSelectors");
const SudokuHTMLHandler_1 = require("./Sudoku/SudokuHTMLHandler");
const SudokuMatrixComponent_1 = require("./Sudoku/SudokuMatrixComponent");
const SudokuSolver_1 = require("./Sudoku/SudokuSolver");
class SudokuBoard {
    constructor() {
        this.htmlHandler = new SudokuHTMLHandler_1.SudokuHTMLHandler();
        this.digits = new DigitSelectors_1.DigitSelectors();
        this.matrix = new SudokuMatrixComponent_1.SudokuMatrixComponent();
    }
    /**
     * Reinitialize all of the values to null, in order to regenerate new version
     */
    clearMatrix() {
        this.matrix.clear();
    }
    /**
     * Initiate the first paint of the sudoku grid and associated buttons
     * @param id
     */
    onFirstCreation(id) {
        SudokuHTMLHandler_1.SudokuHTMLHandler.createLoader();
        window.setTimeout(() => {
            this.matrix.startFillProcess();
            const solution = (0, SudokuSolver_1.getSameSolutionMatrix)(this.matrix.getMatrix());
            this.htmlHandler.createBoard(id, this.digits);
            this.digits.generate();
            this.htmlHandler.putToHTML(solution, this.matrix.getMatrix());
            this.htmlHandler.addSquareKeyboardListeners(this.matrix.getMatrix());
            this.htmlHandler.highlightSquaresOnClick();
        }, 1000);
    }
    /**
     * User asking to get a new grid
     */
    onRegeneration() {
        this.matrix.clear();
        this.htmlHandler.eraseModifiableInput();
        this.digits.removeHTML();
        this.clearBoard();
        SudokuHTMLHandler_1.SudokuHTMLHandler.createLoader();
        window.setTimeout(() => {
            this.matrix.startFillProcess();
            const solution = (0, SudokuSolver_1.getSameSolutionMatrix)(this.matrix.getMatrix());
            // Remove loader
            this.htmlHandler.createBoard('sudoku-section', this.digits);
            this.digits.generate();
            this.htmlHandler.putToHTML(solution, this.matrix.getMatrix());
            this.htmlHandler.addSquareKeyboardListeners(this.matrix.getMatrix());
            this.htmlHandler.highlightSquaresOnClick();
            this.htmlHandler.removeWinMessage();
        }, 1000);
    }
    /**
     * Erase user-values entered for current Grid
     */
    erase() {
        this.digits.generate();
        this.digits.unselect();
        this.htmlHandler.setCurrentSelectedValue("");
        this.htmlHandler.clearNodesBackground();
        this.htmlHandler.eraseUserInputOnCurrentGrid();
    }
    /**
     * Remove any square selection
     */
    clearBoard() {
        this.digits.unselect();
        this.htmlHandler.setCurrentSelectedValue("");
        this.htmlHandler.clearNodesBackground();
    }
    /**
     * Gets the GridNode matrix
     * @returns
     */
    getMatrix() {
        return this.matrix.getMatrix();
    }
}
exports.SudokuBoard = SudokuBoard;

},{"./DigitSelectors":2,"./Sudoku/SudokuHTMLHandler":8,"./Sudoku/SudokuMatrixComponent":9,"./Sudoku/SudokuSolver":10}],6:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SudokuHTMLHandler = void 0;
const constants_1 = require("./constants");
const GridNode_1 = require("./GridNode");
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
     *HTML CSS MATRIX creation -- generates only the squares, not the content
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
            (_a = document.getElementById(`square-${x}`)) === null || _a === void 0 ? void 0 : _a.classList.remove("selected");
        }
        this.currentSelectedBtn = "";
    }
    highlight(value) {
        for (let i = 0; i < 81; i++) {
            const node = document.getElementById(`square-${i}`);
            const val = Number(node === null || node === void 0 ? void 0 : node.innerText);
            node === null || node === void 0 ? void 0 : node.classList.remove("selected");
            if ((node === null || node === void 0 ? void 0 : node.innerText) && val === value)
                node.classList.add("selected");
        }
    }
    erase(matrix) {
        for (let i = 0; i < constants_1.SIDE_LENGTH; i++) {
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

},{"./GridNode":3,"./constants":13}],7:[function(require,module,exports){
"use strict";
/**
 * SudokuGeneratorUtils.ts
 * Collection of utility functions used while generating the sudoku matrix
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.SudokuGeneratorUtils = void 0;
const constants_1 = require("../constants");
class SudokuGeneratorUtils {
    constructor() { }
    /**
     * Check which values could fit into current evaluated square
     * @param matrix
     * @param row
     * @param col
     * @returns
     */
    getPossibleValuesForOneSquare(matrix, row, col) {
        const possibilities = Array(constants_1.SIDE_LENGTH).fill(0).map((_, i) => i + 1);
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
        if (col + 1 > constants_1.SIDE_LENGTH - 1)
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

},{"../constants":13}],8:[function(require,module,exports){
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
        boardContainer.replaceChildren(); // Eliminate loader
        for (let i = 0; i < constants_1.SIDE_LENGTH; i++) {
            boardContainer.appendChild(this.createLine(i, digits));
        }
        this.setLargerBorders();
    }
    static createLoader() {
        var _a;
        document.getElementById('sudoku-section').replaceChildren();
        const loader = document.createElement('div');
        loader.classList.add('rotator');
        (_a = document.getElementById('sudoku-section')) === null || _a === void 0 ? void 0 : _a.appendChild(loader);
    }
    /**
    * Put matrix values into HTML board representation and decide which ones are shown
    * @param matrix - Board Matrix
    */
    putToHTML(unfilledMatrix, matrixComponent) {
        var _a;
        for (let i = 0; i < constants_1.SIDE_LENGTH; i++) {
            for (let j = 0; j < constants_1.SIDE_LENGTH; j++) {
                const id = i * constants_1.SIDE_LENGTH + j;
                const node = document.getElementById(`square-${id}`);
                if (node) {
                    node.innerText = ((_a = unfilledMatrix[i][j].getValue()) === null || _a === void 0 ? void 0 : _a.toString()) || '';
                    node.innerText === "" && matrixComponent[i][j].setModifiable(true);
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

},{"../DigitSelectors":2,"../GridNode":3,"../Timer":12,"../constants":13,"./SudokuValidator":11}],9:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SudokuMatrixComponent = void 0;
const constants_1 = require("../constants");
const GridNode_1 = require("../GridNode");
const SudokuGeneratorUtils_1 = require("./SudokuGeneratorUtils");
/**
 * Representation of the code matrix used to generate the grid
 */
class SudokuMatrixComponent {
    constructor() {
        this.matrix = [];
        this.matrix = Array(constants_1.SIDE_LENGTH).fill(0).map(() => Array(constants_1.SIDE_LENGTH).fill(0).map(() => new GridNode_1.GridNode()));
    }
    /**
     * get the sudoku matrix
     * @returns any[][]
     */
    getMatrix() {
        return this.matrix;
    }
    startFillProcess() {
        this.fill(this.matrix, 0, 0);
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
        const possibilities = SudokuGeneratorUtils_1.SudokuGeneratorUtils.prototype.getPossibleValuesForOneSquare(matrix, row, col);
        if (possibilities.length === 0) {
            return null;
        }
        // If we get to this specific point, then we have found a complete grid and need to quit as the for loop would reset to 0;
        if (this.isComplete(row, col)) {
            matrix[row][col].setValue(possibilities[0]);
            return matrix;
        }
        // Shuffle Array of possibilities to generate multiple grids
        possibilities.sort(() => Math.random() > 0.5 ? 1 : -1);
        // ensure next does not go out of range
        const rowsend = row + 1 > constants_1.SIDE_LENGTH - 1 ? 0 : row + 1;
        const colsend = SudokuGeneratorUtils_1.SudokuGeneratorUtils.prototype.getNextSquareCol(rowsend, col);
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
    /**
     * Reinitiate all of the squares and matrix values
     */
    clear() {
        for (let i = 0; i < constants_1.SIDE_LENGTH; i++) {
            for (let j = 0; j < constants_1.SIDE_LENGTH; j++) {
                this.matrix[i][j].reinitiate();
            }
        }
    }
    isComplete(row, col) {
        return row == constants_1.SIDE_LENGTH - 1 && col == constants_1.SIDE_LENGTH - 1;
    }
}
exports.SudokuMatrixComponent = SudokuMatrixComponent;

},{"../GridNode":3,"../constants":13,"./SudokuGeneratorUtils":7}],10:[function(require,module,exports){
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

},{"../GridNode":3,"../constants":13,"./SudokuGeneratorUtils":7}],11:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SudokuValidator = void 0;
const constants_1 = require("../constants");
const SudokuGeneratorUtils_1 = require("./SudokuGeneratorUtils");
const SudokuHTMLHandler_1 = require("./SudokuHTMLHandler");
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
     * On each entry, recompute values that were labelled wrong
     * @param currentId - avoid recomputing the value just entered by the user
     */
    static recomputeWrongValues(currentId) {
        document.querySelectorAll('.wrong').forEach(node => {
            const nodeid = Number(node.id.split('-')[1]);
            if (nodeid !== currentId) {
                const r = Math.trunc(nodeid / constants_1.SIDE_LENGTH);
                const c = nodeid % constants_1.SIDE_LENGTH;
                const value = Number(node.innerText);
                if (SudokuValidator.prototype.isCorrect(value, r, c, nodeid)) {
                    node.classList.remove("wrong");
                }
            }
        });
    }
    /**
     * If the whole grid is filled with no error, it's the end
     * @returns
     */
    static checkEndGame() {
        for (let i = 0; i < constants_1.SIDE_LENGTH * constants_1.SIDE_LENGTH; i++) {
            const node = document.getElementById(`square-${i}`);
            if ((node === null || node === void 0 ? void 0 : node.innerHTML) == '' || (node === null || node === void 0 ? void 0 : node.classList.contains("wrong"))) {
                return false;
            }
        }
        SudokuHTMLHandler_1.SudokuHTMLHandler.endGame();
        return true;
    }
}
exports.SudokuValidator = SudokuValidator;

},{"../constants":13,"./SudokuGeneratorUtils":7,"./SudokuHTMLHandler":8}],12:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Timer = void 0;
class Timer {
    /**
     * Start Timer
     * @param htmlId -- Node id containing the text to display
     */
    static start(htmlId) {
        Timer.intervalID = window.setInterval(() => {
            if (++Timer.seconds == 60) {
                Timer.minutes++;
                Timer.seconds = 0;
            }
            if (Timer.minutes === 60) {
                Timer.hours++;
                Timer.minutes = 0;
            }
            document.getElementById(htmlId).innerText = this.getTimeString();
        }, 1000);
    }
    static stop() {
        window.clearInterval(Timer.intervalID);
    }
    static getTimeString() {
        const hformat = Timer.format(Timer.hours);
        const mformat = Timer.format(Timer.minutes);
        const sformat = Timer.format(Timer.seconds);
        return `${hformat}:${mformat}:${sformat}`;
    }
    static format(arg) {
        return arg < 10 ? `0${arg}` : arg;
    }
    /**
     * Restart timer on Grid change
     * @param htmlId - Node id containing the text
     */
    static restart(htmlId) {
        Timer.minutes = 0;
        Timer.seconds = 0;
        Timer.hours = 0;
        window.clearInterval(Timer.intervalID);
        document.getElementById(htmlId).innerText = "00:00:00";
        Timer.start(htmlId);
    }
}
exports.Timer = Timer;
Timer.seconds = 0;
Timer.minutes = 0;
Timer.hours = 0;
Timer.intervalID = 0;

},{}],13:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SIDE_LENGTH = void 0;
exports.SIDE_LENGTH = 9;

},{}],14:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.testPerformance = void 0;
function testPerformance(fn, iteration = 10000) {
    let s = performance.now();
    for (let i = 0; i < iteration; i++) {
        fn();
    }
    let e = performance.now();
    return e - s;
}
exports.testPerformance = testPerformance;

},{}]},{},[1]);
