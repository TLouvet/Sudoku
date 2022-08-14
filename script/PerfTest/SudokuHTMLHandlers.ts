import { SIDE_LENGTH } from "../constants";
import { testPerformance } from "../test";

////////// Remove node modification
// 20ms -- 10k tries Faster
function removeNodeModificationOnWinQS() {
  document.querySelectorAll("[contenteditable='true']")?.forEach(e => e.removeAttribute("contenteditable"));
}

// 80ms -- 10k tries Slower
function removeNodeModificationOnWinWholeLoop() {
  for (let i = 0; i < SIDE_LENGTH * SIDE_LENGTH; i++) {
    document.getElementById(`square-${i}`)?.removeAttribute("contenteditable");
  }
}

/////////// HighlightSquares

// 2650ms for 1k iter -- SLOW
function highlightSquaresOnClickLoop() {
  for (let i = 0; i < 81; i++) {
    const square = document.getElementById(`square-${i}`)
    square?.addEventListener("click", (e) => {
      const value = Number((e as any).target?.innerText);
      highlightQS(value);
      //highlightLoop(value);
    })
  }
}

// 500ms for 1k iter -- Faster
function highlightSquaresOnClickQS() {
  document.querySelectorAll('[id^="square-"]')?.forEach(e => e.addEventListener("click", (evt) => {
    const value = Number((evt as any).target?.innerText);
    //highlightQS(value);
    highlightLoop(value);
  }))
}


////// Highlight function -- both have same speed given that both highlight caller perform the same with each.

function highlightQS(value: number) {
  document.querySelectorAll('.selected')?.forEach(n => n.classList.remove("selected"));
  document.querySelectorAll('[id^="square-"]')?.forEach(e => {
    const val = Number((e as HTMLElement).innerText);
    if (val && val === value) {
      e.classList.add("selected");
    }
  })
}

function highlightLoop(value: number) {
  for (let i = 0; i < 81; i++) {
    const node = document.getElementById(`square-${i}`)
    const val = Number(node?.innerText);
    node?.classList.remove("selected");
    if (node?.innerText && val === value) node.classList.add("selected");
  }
}


//// Board Regeneration

//50ms - 1k 
function onNewGenerationClearLoop() {
  for (let i = 0; i < SIDE_LENGTH; i++) {
    for (let j = 0; j < SIDE_LENGTH; j++) {
      const node = document.getElementById(`square-${i * SIDE_LENGTH + j}`);
      node?.removeAttribute("contenteditable");
      node?.classList.remove("modifiable", "wrong");
    }
  }
}

// 2ms - 1k
function onNewGenerationClearQS() {
  document.querySelectorAll('[contenteditable="true]')?.forEach(node => {
    node.removeAttribute("contenteditable");
    node.classList.remove("modifiable", "wrong");
  })
}


export function startSudokuHTMLHandlePerfTest() {
  console.log(`Remove Node Modification with HTML List of contenteditable: ${testPerformance(removeNodeModificationOnWinQS)} milliseconds on 10k iterations`);
  console.log(`Remove Node Modification with for loop on every square: ${testPerformance(removeNodeModificationOnWinWholeLoop)} milliseconds on 10k iterations`);

  console.log(`Testing Highlight caller function - HTML LIST: ${testPerformance(highlightSquaresOnClickLoop, 1000)}ms on 1k iterations`);
  console.log(`Testing Highlight caller function - Loop: ${testPerformance(highlightSquaresOnClickQS, 1000)}ms on 1k iterations`);

  console.log(`Testing remove modifiable inputs - HTML LIST: ${testPerformance(onNewGenerationClearQS, 1000)}ms on 1k iterations`);
  console.log(`Testing remove modifiable inputs - Loop: ${testPerformance(onNewGenerationClearLoop, 1000)}ms on 1k iterations`);
}

