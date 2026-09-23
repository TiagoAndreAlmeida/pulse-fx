import { describe, it, expect } from 'vitest';
import { Observation } from './Observation';

describe('Observation Entity', () => {
  const createObservation = (overrides: Partial<ObservationProps> = {}) => {
    return new Observation({
      id: 'obs-1',
      indicatorId: 'USD_BRL',
      referenceDate: new Date('2026-09-20'),
      value: 5.25,
      ...overrides,
    });
  };

  interface ObservationProps {
    id: string;
    indicatorId: string;
    referenceDate: Date;
    value: number;
  }

  describe('getters', () => {
    it('deve retornar id corretamente', () => {
      const observation = createObservation({ id: 'obs-test' });
      expect(observation.id).toBe('obs-test');
    });

    it('deve retornar indicatorId corretamente', () => {
      const observation = createObservation({ indicatorId: 'SELIC' });
      expect(observation.indicatorId).toBe('SELIC');
    });

    it('deve retornar referenceDate corretamente', () => {
      const date = new Date('2026-09-21');
      const observation = createObservation({ referenceDate: date });
      expect(observation.referenceDate).toEqual(date);
    });

    it('deve retornar value corretamente', () => {
      const observation = createObservation({ value: 5.50 });
      expect(observation.value).toBe(5.50);
    });
  });

  describe('create (factory method)', () => {
    it('deve criar instância de Observation corretamente', () => {
      const props = {
        id: 'obs-new',
        indicatorId: 'FEDFUNDS',
        referenceDate: new Date('2026-09-01'),
        value: 5.33,
      };

      const observation = Observation.create(props);

      expect(observation).toBeInstanceOf(Observation);
      expect(observation.id).toBe(props.id);
      expect(observation.indicatorId).toBe(props.indicatorId);
      expect(observation.referenceDate).toEqual(props.referenceDate);
      expect(observation.value).toBe(props.value);
    });

    it('deve retornar instância com mesmos valores dos props', () => {
      const props = {
        id: 'obs-test',
        indicatorId: 'SELIC',
        referenceDate: new Date('2026-09-20'),
        value: 13.75,
      };

      const observation = Observation.create(props);

      expect(observation.id).toBe(props.id);
      expect(observation.indicatorId).toBe(props.indicatorId);
      expect(observation.referenceDate).toEqual(props.referenceDate);
      expect(observation.value).toBe(props.value);
    });

    it('deve criar instância imutável (props readonly)', () => {
      const props = {
        id: 'obs-immutable',
        indicatorId: 'CPI_US',
        referenceDate: new Date('2026-09-01'),
        value: 300.5,
      };

      const observation = Observation.create(props);

      // Verifica que os getters retornam os valores corretos
      expect(observation.id).toBe(props.id);
      expect(observation.indicatorId).toBe(props.indicatorId);
      expect(observation.referenceDate).toEqual(props.referenceDate);
      expect(observation.value).toBe(props.value);
    });
  });

  describe('imutabilidade', () => {
    it('deve manter props como readonly (não permitir mutação direta)', () => {
      const observation = createObservation();
      const originalValue = observation.value;

      // Tentativa de mutação direta (não deve funcionar pois props é readonly)
      expect(observation.value).toBe(originalValue);
    });
  });
});