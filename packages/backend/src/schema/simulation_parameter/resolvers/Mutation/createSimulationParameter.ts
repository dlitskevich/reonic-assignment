import { PrismaClient } from "generated/prisma/client";
import { transformSimulationParameter } from "../utils";
import type { MutationResolvers } from "./../../../types.generated";

interface Context {
  prisma: PrismaClient;
}

export const createSimulationParameter: NonNullable<MutationResolvers['createSimulationParameter']> = async (_parent, { input }, context: Context) => {
  const created = await context.prisma.simulationParameter.create({
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
  return transformSimulationParameter(created);
};
