import { describe, it, expect } from 'vitest';
import { Indicator } from './Indicator';

describe('Indicator Entity', () => {
  const createIndicator = (overrides: Partial<IndicatorProps> = {}) => {
    return new Indicator({
      id: 'USD_BRL',
      name: 'Dólar PTAX',
      source: 'BCB',
      unit: 'CURRENCY',
      frequency: 'DAILY',
      lastValue: 5.25,
      variation: 0.02,
      updatedAt: new Date('2026-09-20'),
      ...overrides,
    });
  };

  interface IndicatorProps {
    id: string;
    name: string;
    source: 'BCB' | 'FRED';
    unit: 'CURRENCY' | 'INDEX' | 'PERCENTAGE';
    frequency: 'DAILY' | 'MONTHLY';
    lastValue: number;
    variation: number;
    updatedAt: Date;
  }

  describe('getters', () => {
    it('deve retornar id corretamente', () => {
      const indicator = createIndicator({ id: 'TEST_ID' });
      expect(indicator.id).toBe('TEST_ID');
    });

    it('deve retornar name corretamente', () => {
      const indicator = createIndicator({ name: 'Test Indicator' });
      expect(indicator.name).toBe('Test Indicator');
    });

    it('deve retornar source corretamente', () => {
      const indicator = createIndicator({ source: 'FRED' });
      expect(indicator.source).toBe('FRED');
    });

    it('deve retornar unit corretamente', () => {
      const indicator = createIndicator({ unit: 'PERCENTAGE' });
      expect(indicator.unit).toBe('PERCENTAGE');
    });

    it('deve retornar frequency corretamente', () => {
      const indicator = createIndicator({ frequency: 'MONTHLY' });
      expect(indicator.frequency).toBe('MONTHLY');
    });

    it('deve retornar lastValue corretamente', () => {
      const indicator = createIndicator({ lastValue: 10.5 });
      expect(indicator.lastValue).toBe(10.5);
    });

    it('deve retornar variation corretamente', () => {
      const indicator = createIndicator({ variation: 1.5 });
      expect(indicator.variation).toBe(1.5);
    });

    it('deve retornar updatedAt corretamente', () => {
      const date = new Date('2026-09-20');
      const indicator = createIndicator({ updatedAt: date });
      expect(indicator.updatedAt).toEqual(date);
    });
  });

  describe('updateValue', () => {
    it('deve atualizar lastValue, variation e updatedAt', () => {
      const indicator = createIndicator();
      const newValue = 5.50;
      const newVariation = 0.05;
      const newDate = new Date('2026-09-21');

      indicator.updateValue(newValue, newVariation, newDate);

      expect(indicator.lastValue).toBe(newValue);
      expect(indicator.variation).toBe(newVariation);
      expect(indicator.updatedAt).toEqual(newDate);
    });

    it('deve permitir atualização com valores negativos', () => {
      const indicator = createIndicator({ lastValue: 5.0, variation: 0 });
      indicator.updateValue(4.5, -0.1, new Date());

      expect(indicator.lastValue).toBe(4.5);
      expect(indicator.variation).toBe(-0.1);
    });

    it('deve permitir atualização com variation zero', () => {
      const indicator = createIndicator();
      indicator.updateValue(5.0, 0, new Date());

      expect(indicator.variation).toBe(0);
    });

    it('deve mutar o estado interno da entidade', () => {
      const indicator = createIndicator({ lastValue: 5.0, variation: 0, updatedAt: new Date('2026-09-20') });
      const originalDate = indicator.updatedAt;

      indicator.updateValue(5.5, 0.1, new Date('2026-09-21'));

      expect(indicator.lastValue).not.toBe(5.0);
      expect(indicator.variation).not.toBe(0);
      expect(indicator.updatedAt).not.toEqual(originalDate);
    });
  });
});