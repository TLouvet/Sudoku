"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.testPerformance = void 0;
function testPerformance(fn, iteration = 10000) {
    let s = performance.now();
    for (let i = 0; i < iteration; i++) {
        fn();
    }
    let e = performance.now();
    return e - s;
}
exports.testPerformance = testPerformance;
