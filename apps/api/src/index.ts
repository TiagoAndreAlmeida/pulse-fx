import "dotenv/config";
import express from "express";
import cors from "cors";
import { startSyncScheduler } from "@/main/cron/syncScheduler";
import { makeSyncExternalIndicatorsUseCase } from "@/main/factories/use-cases";

const app = express();
const PORT = process.env.PORT || 3333;

app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`🚀 API rodando na porta ${PORT}`);
  
  const syncUseCase = makeSyncExternalIndicatorsUseCase();
  startSyncScheduler(syncUseCase);
});