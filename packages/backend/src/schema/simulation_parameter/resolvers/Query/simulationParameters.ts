import { PrismaClient } from "generated/prisma/client";
import type { QueryResolvers } from "./../../../types.generated";
import { transformSimulationParameter } from "../utils";

interface Context {
  prisma: PrismaClient;
}

export const simulationParameters: NonNullable<
  QueryResolvers["simulationParameters"]
> = async (_parent, _arg, context: Context) => {
  const parameters = await context.prisma.simulationParameter.findMany({
    include: { chargepoints: true },
    orderBy: { id: "desc" },
  });
  return parameters.map(transformSimulationParameter);
};
