#!/usr/bin/env tsx
import "dotenv/config";
import { makeSyncExternalIndicatorsUseCase } from "../src/main/factories/use-cases";

async function main() {
  console.log("🔄 Iniciando teste de sincronização manual...\n");

  const startTime = Date.now();

  try {
    const useCase = makeSyncExternalIndicatorsUseCase();
    const result = await useCase.execute();

    const duration = Date.now() - startTime;

    console.log("✅ Sincronização concluída!");
    console.log(`⏱️  Duração: ${duration}ms\n`);

    console.log("📊 Resultado por indicador:");
    result.items.forEach((item) => {
      const status = item.error ? "❌ ERRO" : "✅ OK";
      const details = item.error
        ? ` | Erro: ${item.error}`
        : ` | Registros sincronizados: ${item.synced}`;
      console.log(`  ${status} ${item.indicatorId}${details}`);
    });

    const totalSynced = result.items.reduce((sum, i) => sum + i.synced, 0);
    const errors = result.items.filter((i) => i.error).length;

    console.log(`\n📈 Resumo: ${totalSynced} registros sincronizados | ${errors} erro(s)`);

    if (errors > 0) {
      console.log("\n⚠️  Verifique logs acima para detalhes dos erros.");
      process.exit(1);
    }
  } catch (error) {
    console.error("❌ Erro fatal durante sincronização:", error);
    process.exit(1);
  }
}

main().catch((error) => {
  console.error("❌ Erro fatal:", error);
  process.exit(1);
});