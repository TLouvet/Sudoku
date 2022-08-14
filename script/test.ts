export function testPerformance(fn: any, iteration: number = 10000) {
  let s = performance.now();
  for (let i = 0; i < iteration; i++) {
    fn();
  }
  let e = performance.now();
  return e - s;
}