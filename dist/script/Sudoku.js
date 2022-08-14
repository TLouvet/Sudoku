"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SudokuBoard = void 0;
const DigitSelectors_1 = require("./DigitSelectors");
const SudokuHTMLHandler_1 = require("./Sudoku/SudokuHTMLHandler");
const SudokuMatrixComponent_1 = require("./Sudoku/SudokuMatrixComponent");
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
        this.htmlHandler.createBoard(id, this.digits);
        this.digits.generate();
        this.matrix.startFillProcess();
        this.htmlHandler.putToHTML(this.matrix.getMatrix());
        this.htmlHandler.addSquareKeyboardListeners(this.matrix.getMatrix());
        this.htmlHandler.highlightSquaresOnClick();
    }
    /**
     * User asking to get a new grid
     */
    onRegeneration() {
        this.matrix.clear();
        this.htmlHandler.eraseModifiableInput();
        this.clearBoard();
        this.matrix.startFillProcess();
        this.htmlHandler.putToHTML(this.matrix.getMatrix());
        this.htmlHandler.addSquareKeyboardListeners(this.matrix.getMatrix());
        this.htmlHandler.removeWinMessage();
    }
    /**
     * Erase user-values entered for current Grid
     */
    erase() {
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
}
exports.SudokuBoard = SudokuBoard;
