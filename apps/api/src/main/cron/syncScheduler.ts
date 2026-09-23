import cron from 'node-cron';
import { SyncExternalIndicatorsUseCase } from '@/use-cases/SyncExternalIndicatorsUseCase';

export function startSyncScheduler(useCase: SyncExternalIndicatorsUseCase): void {
  cron.schedule('0 19 * * *', async () => {
    console.log('[CRON] Iniciando sincronização agendada...');
    try {
      const result = await useCase.execute();
      console.log('[CRON] Sincronização concluída:', result.items.map(i => `${i.indicatorId}: ${i.synced} registros`).join(', '));
      if (result.items.some(i => i.error)) {
        console.error('[CRON] Erros durante sincronização:', result.items.filter(i => i.error).map(i => `${i.indicatorId}: ${i.error}`).join('; '));
      }
    } catch (error) {
      console.error('[CRON] Erro fatal na sincronização:', error);
    }
  });

  console.log('⏰ Scheduler de sincronização iniciado (diário às 19:00)');
}