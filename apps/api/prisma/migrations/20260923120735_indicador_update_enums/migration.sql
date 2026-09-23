/*
  Warnings:

  - Changed the type of `source` on the `indicators` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `unit` on the `indicators` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `frequency` on the `indicators` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "IndicatorSource" AS ENUM ('BCB', 'FRED');

-- CreateEnum
CREATE TYPE "IndicatorFrequency" AS ENUM ('DAILY', 'MONTHLY');

-- CreateEnum
CREATE TYPE "IndicatorUnit" AS ENUM ('CURRENCY', 'INDEX', 'PERCENTAGE');

-- AlterTable
ALTER TABLE "indicators" DROP COLUMN "source",
ADD COLUMN     "source" "IndicatorSource" NOT NULL,
DROP COLUMN "unit",
ADD COLUMN     "unit" "IndicatorUnit" NOT NULL,
DROP COLUMN "frequency",
ADD COLUMN     "frequency" "IndicatorFrequency" NOT NULL;
