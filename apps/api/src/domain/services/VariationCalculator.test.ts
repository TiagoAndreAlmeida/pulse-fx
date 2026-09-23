import { describe, it, expect } from 'vitest';
import { VariationCalculator } from './VariationCalculator';

describe('VariationCalculator', () => {
  it('deve calcular variação positiva', () => {
    const result = VariationCalculator.calculate(110, 100);
    expect(result).toBe(10);
  });

  it('deve calcular variação negativa', () => {
    const result = VariationCalculator.calculate(90, 100);
    expect(result).toBe(-10);
  });

  it('deve retornar 0 quando anterior é 0', () => {
    const result = VariationCalculator.calculate(100, 0);
    expect(result).toBe(0);
  });

  it('deve calcular variação com decimais', () => {
    const result = VariationCalculator.calculate(5.4530, 5.4210);
    expect(result).toBeCloseTo(0.5903, 4);
  });

  it('deve retornar 0 quando valores são iguais', () => {
    const result = VariationCalculator.calculate(100, 100);
    expect(result).toBe(0);
  });
});