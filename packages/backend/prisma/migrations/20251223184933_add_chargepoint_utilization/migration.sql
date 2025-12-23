-- CreateTable
CREATE TABLE "ChargepointUtilization" (
    "id" SERIAL NOT NULL,
    "simulationResultId" INTEGER NOT NULL,
    "powerKw" DOUBLE PRECISION NOT NULL,
    "utilization" DOUBLE PRECISION NOT NULL,
    "avgDailyEvents" DOUBLE PRECISION NOT NULL,
    "avgDailyEnergyKwh" DOUBLE PRECISION NOT NULL,
    "avgMonthlyEvents" DOUBLE PRECISION NOT NULL,
    "avgMonthlyEnergyKwh" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "ChargepointUtilization_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ChargepointUtilization" ADD CONSTRAINT "ChargepointUtilization_simulationResultId_fkey" FOREIGN KEY ("simulationResultId") REFERENCES "SimulationResult"("id") ON DELETE CASCADE ON UPDATE CASCADE;
