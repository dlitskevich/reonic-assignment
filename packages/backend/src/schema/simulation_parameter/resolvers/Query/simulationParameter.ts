import { PrismaClient } from "generated/prisma/client";
import type { QueryResolvers } from "./../../../types.generated";
import { transformSimulationParameter } from "../utils";

interface Context {
  prisma: PrismaClient;
}
export const simulationParameter: NonNullable<QueryResolvers['simulationParameter']> = async (_parent, args, context: Context) => {
  const param = await context.prisma.simulationParameter.findUnique({
    where: { id: args.id },
    include: { chargepoints: true },
  });
  if (!param) return null;
  return transformSimulationParameter(param);
};
