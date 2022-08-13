
/**
 * Representation of a node
 */
export class GridNode {

  constructor(private value: number | null = null, private canBeModified: boolean = false) { }

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

  setModifiable(modif: boolean) {
    this.canBeModified = modif;
  }

  getValue() {
    return this.value;
  }

  setValue(value: number | null) {
    this.value = value;
  }

  /**
  * Node Generation for single square
  * @param row 
  * @param col 
  * @returns 
  */
  createSingleSquare(row: number, col: number, SIDE_LENGTH: number = 9) {
    const square = document.createElement("div");
    square.setAttribute("id", `square-${row * SIDE_LENGTH + col}`);
    square.setAttribute("class", "square");
    // Make selector buttons change depending on selection
    square.addEventListener("click", () => {
      for (let i = 0; i < SIDE_LENGTH; i++) {
        const btn = document.getElementById(`btn-selector-${i}`);
        btn?.classList.remove('btn-current');
        if (btn?.innerText === square.innerText) {
          btn.classList.add('btn-current');
        }
      }
    })
    return square;
  }
}