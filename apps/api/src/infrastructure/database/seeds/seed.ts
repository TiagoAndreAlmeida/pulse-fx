import "dotenv/config";
import { PrismaClient, IndicatorSource, IndicatorUnit, IndicatorFrequency } from '../prisma/generated/client';
import { PrismaPg } from '@prisma/adapter-pg';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const INDICATORS = [
  {
    id: 'USD_BRL',
    name: 'Dólar Comercial PTAX',
    source: IndicatorSource.BCB,
    unit: IndicatorUnit.CURRENCY,
    frequency: IndicatorFrequency.DAILY,
  },
  {
    id: 'SELIC',
    name: 'Taxa Selic Meta',
    source: IndicatorSource.BCB,
    unit: IndicatorUnit.PERCENTAGE,
    frequency: IndicatorFrequency.DAILY,
  },
  {
    id: 'FEDFUNDS',
    name: 'Federal Funds Effective Rate',
    source: IndicatorSource.FRED,
    unit: IndicatorUnit.PERCENTAGE,
    frequency: IndicatorFrequency.MONTHLY,
  },
  {
    id: 'CPI_US',
    name: 'Consumer Price Index - CPI',
    source: IndicatorSource.FRED,
    unit: IndicatorUnit.INDEX,
    frequency: IndicatorFrequency.MONTHLY,
  },
];

async function main() {
  console.log('🌱 Iniciando seed dos indicadores...');

  for (const indicator of INDICATORS) {
    await prisma.indicator.upsert({
      where: { id: indicator.id },
      update: {},
      create: {
        ...indicator,
        lastValue: 0,
        variation: 0,
        updatedAt: new Date(),
      },
    });
    console.log(`  ✓ ${indicator.id} - ${indicator.name}`);
  }

  console.log('✅ Seed concluído!');
}

main()
  .catch((e) => {
    console.error('❌ Erro no seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });