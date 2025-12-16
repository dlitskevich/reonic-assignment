import { PrismaClient } from "../../generated/prisma/client";
import { runSimulation } from "./resolvers/runSimulation";
import { transformSimulationParameter } from "./utils";

export interface Context {
  prisma: PrismaClient;
}

interface ChargepointConfigInput {
  count: number;
  powerKw: number;
}

interface SimulationParameterInput {
  chargepoints: ChargepointConfigInput[];
  consumptionKwhPer100km: number;
  days: number;
  intervalMinutes: number;
  arrivalProbabilityMultiplier: number;
}

export const resolvers = {
  Query: {
    hello: () => "Hello from GraphQL!",

    simulationParameters: async (
      _parent: unknown,
      _args: unknown,
      context: Context
    ) => {
      const parameters = await context.prisma.simulationParameter.findMany({
        include: { chargepoints: true },
        orderBy: { id: "desc" },
      });
      return parameters.map(transformSimulationParameter);
    },
    simulationParameter: async (
      _parent: unknown,
      args: { id: number },
      context: Context
    ) => {
      const param = await context.prisma.simulationParameter.findUnique({
        where: { id: args.id },
        include: { chargepoints: true },
      });
      if (!param) return null;
      return transformSimulationParameter(param);
    },
  },
  Mutation: {
    createSimulationParameter: async (
      _parent: unknown,
      args: { input: SimulationParameterInput },
      context: Context
    ) => {
      const created = await context.prisma.simulationParameter.create({
        data: {
          chargepoints: {
            create: args.input.chargepoints.map((cp) => ({
              count: cp.count,
              powerKw: cp.powerKw,
            })),
          },
          consumptionKwhPer100km: args.input.consumptionKwhPer100km,
          days: args.input.days,
          intervalMinutes: args.input.intervalMinutes,
          arrivalProbabilityMultiplier: args.input.arrivalProbabilityMultiplier,
        },
        include: { chargepoints: true },
      });
      return transformSimulationParameter(created);
    },
    updateSimulationParameter: async (
      _parent: unknown,
      args: { id: number; input: SimulationParameterInput },
      context: Context
    ) => {
      // Use a transaction to ensure atomicity - if update fails, chargepoints are not deleted
      const updated = await context.prisma.$transaction(async (tx) => {
        // Delete existing chargepoints
        await tx.chargepoint.deleteMany({
          where: { simulationParameterId: args.id },
        });

        // Update the simulation parameters and create new chargepoints
        return tx.simulationParameter.update({
          where: { id: args.id },
          data: {
            chargepoints: {
              create: args.input.chargepoints.map((cp) => ({
                count: cp.count,
                powerKw: cp.powerKw,
              })),
            },
            consumptionKwhPer100km: args.input.consumptionKwhPer100km,
            days: args.input.days,
            intervalMinutes: args.input.intervalMinutes,
            arrivalProbabilityMultiplier:
              args.input.arrivalProbabilityMultiplier,
          },
          include: { chargepoints: true },
        });
      });
      return transformSimulationParameter(updated);
    },
    deleteSimulationParameter: async (
      _parent: unknown,
      args: { id: number },
      context: Context
    ) => {
      await context.prisma.simulationParameter.delete({
        where: { id: args.id },
      });
      return true;
    },
    runSimulation,
  },
};
