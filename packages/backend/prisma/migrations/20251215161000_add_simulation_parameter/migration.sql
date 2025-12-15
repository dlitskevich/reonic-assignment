-- CreateTable
CREATE TABLE "SimulationParameter" (
    "id" SERIAL NOT NULL,
    "consumptionKwhPer100km" DOUBLE PRECISION NOT NULL,
    "days" INTEGER NOT NULL,
    "intervalMinutes" INTEGER NOT NULL,
    "arrivalProbabilityMultiplier" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SimulationParameter_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Chargepoint" (
    "id" SERIAL NOT NULL,
    "simulationParameterId" INTEGER NOT NULL,
    "powerKw" DOUBLE PRECISION NOT NULL,
    "count" INTEGER NOT NULL,

    CONSTRAINT "Chargepoint_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Chargepoint" ADD CONSTRAINT "Chargepoint_simulationParameterId_fkey" FOREIGN KEY ("simulationParameterId") REFERENCES "SimulationParameter"("id") ON DELETE CASCADE ON UPDATE CASCADE;
