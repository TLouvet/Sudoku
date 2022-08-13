/**
 * DgitiSelectors.ts
 * These buttons allow the user to see which squares hold their values.
 * On click on one digit, its value becomes the one used to fill empty squares by default
 */
import { SudokuHTMLHandler } from "./SudokuHTMLHandler";

export class DigitSelectors {

  private currentSelected = -1;
  constructor() { }

  getCurrentSelectedID() {
    return this.currentSelected;
  }

  //Creation 

  generate() {
    const parent = document.getElementById("selectors");
    for (let i = 0; i < 9; i++) {
      const btn = document.createElement("button");
      btn.setAttribute("id", `btn-selector-${i}`);
      btn.setAttribute("class", "btn ml-10");
      btn.innerText = `${i + 1}`;
      this.setListener(btn, i);
      parent?.appendChild(btn);
    }
  }

  setListener(node: HTMLButtonElement, id: number,) {
    node.addEventListener("click", () => {
      SudokuHTMLHandler.prototype.highlight(id + 1);
      this.makeNewCurrent(id, node);
    })
  }

  // Current btn operations

  unselect() {
    document.getElementById(`btn-selector-${this.currentSelected}`)?.classList.remove("btn-current");
    this.currentSelected = -1;
  }

  /**
   * Make clicked button the vue selector + default filling option
   * @param htmlIdNbr 
   * @param btn 
   */
  makeNewCurrent(htmlIdNbr: number, btn: HTMLButtonElement) {
    this.unselect();
    this.currentSelected = htmlIdNbr;
    btn.classList.add("btn-current");
  }
}