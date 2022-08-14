import { DigitSelectors } from "./DigitSelectors";
import { SudokuHTMLHandler } from "./Sudoku/SudokuHTMLHandler";
import { SudokuMatrixComponent } from "./Sudoku/SudokuMatrixComponent";
import { getSameSolutionMatrix } from "./Sudoku/SudokuSolver";

export class SudokuBoard {

  private htmlHandler = new SudokuHTMLHandler();
  private digits = new DigitSelectors();
  private matrix = new SudokuMatrixComponent();

  constructor() { }

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
  onFirstCreation(id: string) {
    SudokuHTMLHandler.createLoader();
    window.setTimeout(() => {
      this.matrix.startFillProcess();
      const solution = getSameSolutionMatrix(this.matrix.getMatrix());
      this.htmlHandler.createBoard(id, this.digits);
      this.digits.generate();
      this.htmlHandler.putToHTML(solution, this.matrix.getMatrix());
      this.htmlHandler.addSquareKeyboardListeners(this.matrix.getMatrix());
      this.htmlHandler.highlightSquaresOnClick();
    }, 1000)
  }

  /**
   * User asking to get a new grid
   */
  onRegeneration() {
    this.matrix.clear();
    this.htmlHandler.eraseModifiableInput();
    this.digits.removeHTML();
    this.clearBoard();

    SudokuHTMLHandler.createLoader();
    window.setTimeout(() => {
      this.matrix.startFillProcess();
      const solution = getSameSolutionMatrix(this.matrix.getMatrix());
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
