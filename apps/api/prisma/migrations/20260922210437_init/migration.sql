-- CreateTable
CREATE TABLE "indicators" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "unit" TEXT NOT NULL,
    "frequency" TEXT NOT NULL,
    "last_value" DECIMAL(12,4) NOT NULL,
    "variation" DECIMAL(8,4) NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "indicators_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "observations" (
    "id" TEXT NOT NULL,
    "indicator_id" TEXT NOT NULL,
    "reference_date" TIMESTAMP(3) NOT NULL,
    "value" DECIMAL(12,4) NOT NULL,

    CONSTRAINT "observations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "favorites" (
    "indicator_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "favorites_pkey" PRIMARY KEY ("indicator_id")
);

-- CreateIndex
CREATE INDEX "observations_indicator_id_reference_date_idx" ON "observations"("indicator_id", "reference_date");

-- CreateIndex
CREATE UNIQUE INDEX "observations_indicator_id_reference_date_key" ON "observations"("indicator_id", "reference_date");

-- AddForeignKey
ALTER TABLE "observations" ADD CONSTRAINT "observations_indicator_id_fkey" FOREIGN KEY ("indicator_id") REFERENCES "indicators"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "favorites" ADD CONSTRAINT "favorites_indicator_id_fkey" FOREIGN KEY ("indicator_id") REFERENCES "indicators"("id") ON DELETE CASCADE ON UPDATE CASCADE;
