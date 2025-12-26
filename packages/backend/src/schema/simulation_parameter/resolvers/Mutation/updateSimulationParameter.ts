import { PrismaClient } from "generated/prisma/client";
import { transformSimulationParameter } from "../utils";
import type { MutationResolvers } from "./../../../types.generated";

interface Context {
  prisma: PrismaClient;
}

export const updateSimulationParameter: NonNullable<MutationResolvers['updateSimulationParameter']> = async (_parent, { id, input }, context: Context) => {
  // Use a transaction to ensure atomicity - if update fails, chargepoints are not deleted
  const updated = await context.prisma.$transaction(async (tx) => {
    // Delete existing chargepoints
    await tx.chargepoint.deleteMany({
      where: { simulationParameterId: id },
    });

    // Update the simulation parameters and create new chargepoints
    return tx.simulationParameter.update({
      where: { id: id },
      data: {
        chargepoints: {
          create: input.chargepoints.map((cp) => ({
            count: cp.count,
            powerKw: cp.powerKw,
          })),
        },
        consumptionKwhPer100km: input.consumptionKwhPer100km,
        days: input.days,
        intervalMinutes: input.intervalMinutes,
        arrivalProbabilityMultiplier: input.arrivalProbabilityMultiplier,
      },
      include: { chargepoints: true },
    });
  });
  return transformSimulationParameter(updated);
};
