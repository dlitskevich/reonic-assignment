import { PrismaClient } from "../../generated/prisma/client";
import { runSimulation } from "./resolvers/runSimulation.js";

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
      return parameters.map((param) => ({
        ...param,
        chargepoints: param.chargepoints.map((cp) => ({
          count: cp.count,
          powerKw: cp.powerKw,
        })),
        createdAt: param.createdAt.toISOString(),
        updatedAt: param.updatedAt.toISOString(),
      }));
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
      return {
        ...param,
        chargepoints: param.chargepoints.map((cp) => ({
          count: cp.count,
          powerKw: cp.powerKw,
        })),
        createdAt: param.createdAt.toISOString(),
        updatedAt: param.updatedAt.toISOString(),
      };
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
      return {
        ...created,
        chargepoints: created.chargepoints.map((cp) => ({
          count: cp.count,
          powerKw: cp.powerKw,
        })),
        createdAt: created.createdAt.toISOString(),
        updatedAt: created.updatedAt.toISOString(),
      };
    },
    updateSimulationParameter: async (
      _parent: unknown,
      args: { id: number; input: SimulationParameterInput },
      context: Context
    ) => {
      // First, delete existing chargepoints
      await context.prisma.chargepoint.deleteMany({
        where: { simulationParameterId: args.id },
      });

      // Then update the simulation parameters and create new chargepoints
      const updated = await context.prisma.simulationParameter.update({
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
          arrivalProbabilityMultiplier: args.input.arrivalProbabilityMultiplier,
        },
        include: { chargepoints: true },
      });
      return {
        ...updated,
        chargepoints: updated.chargepoints.map((cp) => ({
          count: cp.count,
          powerKw: cp.powerKw,
        })),
        createdAt: updated.createdAt.toISOString(),
        updatedAt: updated.updatedAt.toISOString(),
      };
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
