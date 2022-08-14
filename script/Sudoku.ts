import { DigitSelectors } from "./DigitSelectors";
import { SudokuHTMLHandler } from "./Sudoku/SudokuHTMLHandler";
import { SudokuMatrixComponent } from "./Sudoku/SudokuMatrixComponent";

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

}
