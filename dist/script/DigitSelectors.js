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
