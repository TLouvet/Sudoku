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
