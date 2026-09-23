import { IExternalProvider } from '@/domain/repositories/IExternalProvider';
import { BcbSgsProvider } from '@/infrastructure/clients/BcbSgsProvider';
import { FredApiProvider } from '@/infrastructure/clients/FredApiProvider';

export function makeBcbProvider(): IExternalProvider {
  return new BcbSgsProvider();
}

export function makeFredProvider(): IExternalProvider {
  return new FredApiProvider();
}