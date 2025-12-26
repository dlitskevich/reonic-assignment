import { PrismaClient } from "generated/prisma/client";
import type { MutationResolvers } from "./../../../types.generated";

interface Context {
  prisma: PrismaClient;
}

export const deleteSimulationParameter: NonNullable<MutationResolvers['deleteSimulationParameter']> = async (_parent, { id }, context: Context) => {
  await context.prisma.simulationParameter.delete({
    where: { id },
  });
  return true;
};
