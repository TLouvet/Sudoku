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
