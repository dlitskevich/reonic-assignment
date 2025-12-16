import { generateMockResults } from "../../utils/simulation.js";
import { SimulationParameters } from "../../utils/types.js";
import type { Context } from "../resolvers.js";

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

/**
 * Helper to compare chargepoints (order doesn't matter)
 */
function compareChargepoints(
  cp1: ChargepointConfigInput[],
  cp2: ChargepointConfigInput[]
): boolean {
  const sorted1 = [...cp1].sort((a, b) => {
    if (a.powerKw !== b.powerKw) return a.powerKw - b.powerKw;
    return a.count - b.count;
  });
  const sorted2 = [...cp2].sort((a, b) => {
    if (a.powerKw !== b.powerKw) return a.powerKw - b.powerKw;
    return a.count - b.count;
  });
  if (sorted1.length !== sorted2.length) return false;
  return sorted1.every(
    (cp, i) =>
      cp.count === sorted2[i].count && cp.powerKw === sorted2[i].powerKw
  );
}

/**
 * Run simulation resolver
 */
export async function runSimulation(
  _parent: unknown,
  args: { input: SimulationParameterInput },
  context: Context
) {
  // Check if parameters already exist by querying with filters first
  // This is more efficient than fetching all parameters
  const candidates = await context.prisma.simulationParameter.findMany({
    where: {
      consumptionKwhPer100km: args.input.consumptionKwhPer100km,
      days: args.input.days,
      intervalMinutes: args.input.intervalMinutes,
      arrivalProbabilityMultiplier: args.input.arrivalProbabilityMultiplier,
    },
    include: { chargepoints: true },
  });

  // Find existing parameter with matching chargepoint configuration
  // Chargepoint comparison still needs to be done in memory since Prisma
  // doesn't support deep nested array comparisons
  let existingParam = candidates.find((param) =>
    compareChargepoints(args.input.chargepoints, param.chargepoints)
  );

  let simulationParameterId: number;

  if (existingParam) {
    simulationParameterId = existingParam.id;
  } else {
    // Create new parameter
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
    });
    simulationParameterId = created.id;
  }

  // Run mock simulation
  const simulationParams: SimulationParameters = {
    chargepoints: args.input.chargepoints,
    consumptionKwhPer100km: args.input.consumptionKwhPer100km,
    days: args.input.days,
    intervalMinutes: args.input.intervalMinutes,
    arrivalProbabilityMultiplier: args.input.arrivalProbabilityMultiplier,
  };

  const results = generateMockResults(simulationParams);

  // Save results to database
  const savedResult = await context.prisma.simulationResult.create({
    data: {
      simulationParameterId,
      totalEnergyKwh: results.totalEnergyKwh,
      maxPowerKw: results.maxPowerKw,
      maxTheoreticalPowerKw: results.maxTheoreticalPowerKw,
      concurrencyFactor: results.concurrencyFactor,
      aggregatedDailyData: {
        create: {
          totalIntervals: results.aggregatedDailyData.totalIntervals,
          intervalMinutes: results.aggregatedDailyData.intervalMinutes,
          dailyStats: {
            create: {
              avg: results.aggregatedDailyData.dailyStats.avg,
              max: results.aggregatedDailyData.dailyStats.max,
              min: results.aggregatedDailyData.dailyStats.min,
            },
          },
          intervalDataPoints: {
            create: results.aggregatedDailyData.intervalDataPoints.map(
              (point) => {
                // Parse time string (HH:MM) and create a Date object
                // Using a fixed date (1970-01-01) for time-only storage
                const [hours, minutes] = point.time.split(":").map(Number);
                const timeDate = new Date(1970, 0, 1, hours, minutes, 0);
                return {
                  interval: point.interval,
                  time: timeDate,
                  avg: point.avg,
                  max: point.max,
                  min: point.min,
                };
              }
            ),
          },
        },
      },
      powerHistogramDataPoints: {
        create: results.powerHistogram.map((point) => ({
          maxPowerKw: point.maxPowerKw,
          count: point.count,
          percentage: point.percentage,
        })),
      },
    },
    include: {
      aggregatedDailyData: {
        include: {
          dailyStats: true,
          intervalDataPoints: true,
        },
      },
      powerHistogramDataPoints: true,
    },
  });

  // Transform to GraphQL response format
  return {
    id: savedResult.id,
    totalEnergyKwh: savedResult.totalEnergyKwh,
    maxPowerKw: savedResult.maxPowerKw,
    maxTheoreticalPowerKw: savedResult.maxTheoreticalPowerKw,
    concurrencyFactor: savedResult.concurrencyFactor,
    simulationParameterId: savedResult.simulationParameterId,
    aggregatedDailyData: savedResult.aggregatedDailyData
      ? {
          dailyStats: savedResult.aggregatedDailyData.dailyStats
            ? {
                avg: savedResult.aggregatedDailyData.dailyStats.avg,
                max: savedResult.aggregatedDailyData.dailyStats.max,
                min: savedResult.aggregatedDailyData.dailyStats.min,
              }
            : null,
          intervalDataPoints:
            savedResult.aggregatedDailyData.intervalDataPoints.map((point) => ({
              interval: point.interval,
              time: point.time.toTimeString().slice(0, 5), // Format as HH:MM
              avg: point.avg,
              max: point.max,
              min: point.min,
            })),
          totalIntervals: savedResult.aggregatedDailyData.totalIntervals,
          intervalMinutes: savedResult.aggregatedDailyData.intervalMinutes,
        }
      : null,
    powerHistogram: savedResult.powerHistogramDataPoints.map((point) => ({
      maxPowerKw: point.maxPowerKw,
      count: point.count,
      percentage: point.percentage,
    })),
    createdAt: savedResult.createdAt.toISOString(),
    updatedAt: savedResult.updatedAt.toISOString(),
  };
}
