import { GridNode } from "./GridNode";

export class SudokuHTMLHandler {

  constructor(private SIDE_LENGTH: number = 9) { }

  /**
   *HTML CSS MATRIX creation -- generates only the squares, not the content
   *@param {string} - id -- Tag ID to add board node  
   */
  createBoard(id: string) {
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
  private createLine(row: number) {
    const div = document.createElement("div");
    div.setAttribute('id', `line-${row}`);
    div.setAttribute("class", "line");

    for (let col = 0; col < this.SIDE_LENGTH; col++) {
      div.appendChild(GridNode.prototype.createSingleSquare(row, col));
    }

    return div;
  }

  /**
   * HTML Borders of main square and sub-squares
   */
  private setLargerBorders() {
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

  private generateMultipleSquaresBorder(start: number, end: number, step: number, className: string) {
    if (start > end) {
      return;
    }

    for (let i = start; i < end; i += step) {
      const div = document.getElementById(`square-${i}`);
      div?.classList.add(className);
    }
  }

  /**
  * Put matrix values into HTML board representation
  * @param matrix - Board Matrix 
  */
  putToHTML(matrix: GridNode[][]) {
    for (let i = 0; i < this.SIDE_LENGTH; i++) {
      for (let j = 0; j < this.SIDE_LENGTH; j++) {
        const id = i * this.SIDE_LENGTH + j;
        const node = document.getElementById(`square-${id}`);
        if (node) {
          node.innerText = Math.random() > 0.55 ? matrix[i][j].getValue()!.toString() : ""; // Quand on enlève ici il faut aussi modif la matrix du coup
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
      if (node?.classList.contains("selected")) node.classList.remove("selected");
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
        this.highlight(i + 1);
        for (let j = 0; j < 9; j++) {
          document.getElementById(`btn-selector-${j}`)?.classList.remove("btn-current");
        }
        btn.classList.add("btn-current");
      })

      parent?.appendChild(btn);
    }
  }

  highlight(value: number) {
    for (let i = 0; i < 81; i++) {
      const node = document.getElementById(`square-${i}`)
      const isInput = node?.tagName === "INPUT";
      const val = isInput ? (node as HTMLInputElement).value : Number(node?.innerText);
      node?.classList.remove("selected");
      if (node?.innerText && val === value) node.classList.add("selected");
    }
  }

}