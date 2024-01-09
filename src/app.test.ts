// seu_codigo.ts
function soma(a: number, b: number): number {
  return a + b;
}

test('soma 1 + 2 para ser igual a 3', () => {
  expect(soma(1, 2)).toBe(3);
});
