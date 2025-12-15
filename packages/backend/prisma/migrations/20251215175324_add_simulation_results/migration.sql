-- CreateTable
CREATE TABLE "SimulationResult" (
    "id" SERIAL NOT NULL,
    "simulationParameterId" INTEGER,
    "totalEnergyKwh" DOUBLE PRECISION NOT NULL,
    "maxPowerKw" DOUBLE PRECISION NOT NULL,
    "maxTheoreticalPowerKw" DOUBLE PRECISION NOT NULL,
    "concurrencyFactor" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SimulationResult_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AggregatedDailyData" (
    "id" SERIAL NOT NULL,
    "simulationResultId" INTEGER NOT NULL,
    "totalIntervals" INTEGER NOT NULL,
    "intervalMinutes" INTEGER NOT NULL,

    CONSTRAINT "AggregatedDailyData_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DailyStats" (
    "id" SERIAL NOT NULL,
    "aggregatedDailyDataId" INTEGER NOT NULL,
    "avg" DOUBLE PRECISION NOT NULL,
    "max" DOUBLE PRECISION NOT NULL,
    "min" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "DailyStats_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IntervalDataPoint" (
    "id" SERIAL NOT NULL,
    "aggregatedDailyDataId" INTEGER NOT NULL,
    "interval" INTEGER NOT NULL,
    "time" TIMESTAMP(3) NOT NULL,
    "avg" DOUBLE PRECISION NOT NULL,
    "max" DOUBLE PRECISION NOT NULL,
    "min" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "IntervalDataPoint_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PowerHistogramDataPoint" (
    "id" SERIAL NOT NULL,
    "simulationResultId" INTEGER NOT NULL,
    "maxPowerKw" DOUBLE PRECISION NOT NULL,
    "count" INTEGER NOT NULL,
    "percentage" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "PowerHistogramDataPoint_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AggregatedDailyData_simulationResultId_key" ON "AggregatedDailyData"("simulationResultId");

-- CreateIndex
CREATE UNIQUE INDEX "DailyStats_aggregatedDailyDataId_key" ON "DailyStats"("aggregatedDailyDataId");

-- AddForeignKey
ALTER TABLE "SimulationResult" ADD CONSTRAINT "SimulationResult_simulationParameterId_fkey" FOREIGN KEY ("simulationParameterId") REFERENCES "SimulationParameter"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AggregatedDailyData" ADD CONSTRAINT "AggregatedDailyData_simulationResultId_fkey" FOREIGN KEY ("simulationResultId") REFERENCES "SimulationResult"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DailyStats" ADD CONSTRAINT "DailyStats_aggregatedDailyDataId_fkey" FOREIGN KEY ("aggregatedDailyDataId") REFERENCES "AggregatedDailyData"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IntervalDataPoint" ADD CONSTRAINT "IntervalDataPoint_aggregatedDailyDataId_fkey" FOREIGN KEY ("aggregatedDailyDataId") REFERENCES "AggregatedDailyData"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PowerHistogramDataPoint" ADD CONSTRAINT "PowerHistogramDataPoint_simulationResultId_fkey" FOREIGN KEY ("simulationResultId") REFERENCES "SimulationResult"("id") ON DELETE CASCADE ON UPDATE CASCADE;
