import { sampleArrival, sampleChargingEnergy } from "./distributions";
import {
  SimulationParameterInput,
  SimulationResultInput,
  PowerHistogramDataPoint,
  AggregatedDailyDataInput,
  IntervalDataPoint,
  ChargepointUtilization,
} from "../schema/types.generated";

/**
 * Generates simulation results based on the provided parameters.
 */
export function generateResults(
  params: SimulationParameterInput
): SimulationResultInput {
  const totalIntervals = Math.ceil(
    (params.days * 24 * 60) / params.intervalMinutes
  );
  const totlaDays = params.days;
  // Convert multiplier from percentage to factor (100% = 1.0, 200% = 2.0, etc.)
  const arrivalMultiplier = params.arrivalProbabilityMultiplier / 100;

  // Calculate max theoretical power from all chargepoint types
  const maxTheoreticalPower = params.chargepoints.reduce(
    (sum, chargepoint) => sum + chargepoint.count * chargepoint.powerKw,
    0
  );

  const chargepoints = params.chargepoints.flatMap((cp) => {
    return Array.from({ length: cp.count }, () => ({
      powerKw: cp.powerKw,
      demand: 0,
      activeIntervals: 0,
      chargingEvents: 0,
      totalEnergy: 0,
    }));
  });

  const powerHistory: number[] = [];

  for (let i = 1; i <= totalIntervals; i++) {
    const hour = ((i * params.intervalMinutes) / 60) % 24;

    for (const chargepoint of chargepoints) {
      // charging
      if (chargepoint.demand > 0) {
        const energyDelivered = Math.min(
          chargepoint.demand,
          chargepoint.powerKw * (params.intervalMinutes / 60)
        );
        chargepoint.demand -= energyDelivered;

        chargepoint.totalEnergy += energyDelivered;
        chargepoint.activeIntervals++;
      }
      // arrival
      if (chargepoint.demand > 0) {
        continue;
      }
      const arrival = sampleArrival(
        hour,
        params.intervalMinutes,
        arrivalMultiplier
      );
      if (!arrival) {
        continue;
      }
      const energyNeeded = sampleChargingEnergy(params.consumptionKwhPer100km);
      if (energyNeeded <= 0) {
        continue;
      }
      chargepoint.demand = energyNeeded;
      chargepoint.chargingEvents++;
    }

    powerHistory.push(
      chargepoints.reduce(
        (sum, chargepoint) =>
          sum + (chargepoint.demand > 0 ? chargepoint.powerKw : 0),
        0
      )
    );
  }

  const totalEnergy = chargepoints.reduce(
    (sum, chargepoint) => sum + chargepoint.totalEnergy,
    0
  );

  const maxPower = Math.max(...powerHistory);
  const concurrencyFactor = maxPower / maxTheoreticalPower;

  // Calculate daily energy history
  const aggregatedDailyData = calculateDailyData(
    powerHistory,
    params.intervalMinutes
  );

  // Calculate power histogram
  const powerHistogram: PowerHistogramDataPoint[] = calculatePowerHistogram(
    maxPower,
    powerHistory
  );

  // Calculate chargepoint utilization statistics
  const chargepointUtilizations: ChargepointUtilization[] =
    calculateChargepointUtilizations(chargepoints, totalIntervals, totlaDays);

  return {
    totalEnergyKwh: totalEnergy,
    maxPowerKw: maxPower,
    maxTheoreticalPowerKw: maxTheoreticalPower,
    concurrencyFactor,
    aggregatedDailyData,
    powerHistogram,
    chargepointUtilizations,
  };
}

function calculateChargepointUtilizations(
  chargepoints: {
    powerKw: number;
    demand: number;
    activeIntervals: number;
    chargingEvents: number;
    totalEnergy: number;
  }[],
  totalIntervals: number,
  totlaDays: number
): ChargepointUtilization[] {
  return chargepoints.map((chargepoint) => {
    // Utilization: percentage of intervals where at least one chargepoint of this config is active
    const utilization = (chargepoint.activeIntervals / totalIntervals) * 100;

    // Daily averages
    const avgDailyEvents = chargepoint.chargingEvents / totlaDays;
    const avgDailyEnergyKwh = chargepoint.totalEnergy / totlaDays;

    // Monthly averages (approximate: daily * 30)
    const avgMonthlyEvents = avgDailyEvents * 30;
    const avgMonthlyEnergyKwh = avgDailyEnergyKwh * 30;

    return {
      powerKw: chargepoint.powerKw,
      utilization,
      avgDailyEvents,
      avgDailyEnergyKwh,
      avgMonthlyEvents,
      avgMonthlyEnergyKwh,
    };
  });
}

function calculatePowerHistogram(
  maxPower: number,
  powerHistory: number[]
): PowerHistogramDataPoint[] {
  const bins = 20;
  const binSize = maxPower / bins;
  const binsCount = new Array(bins).fill(0);

  powerHistory.forEach((power) => {
    const binIndex = Math.min(Math.floor(power / binSize), bins - 1);
    binsCount[binIndex]++;
  });

  const powerHistogram: PowerHistogramDataPoint[] = binsCount.map(
    (count, index) => ({
      maxPowerKw: (index + 1) * binSize,
      count: count,
      percentage: (count / powerHistory.length) * 100,
    })
  );
  return powerHistogram;
}

/**
 * Calculates daily energy statistics and interval data from power history.
 * Note: doesn't consider early stop of charging.
 */
function calculateDailyData(
  powerHistory: number[],
  intervalMinutes: number
): AggregatedDailyDataInput {
  const intervalsPerDay = (24 * 60) / intervalMinutes;
  const days = Math.ceil(powerHistory.length / intervalsPerDay);
  const dailyEnergies: number[] = [];

  // Calculate total energy delivered per day
  for (let day = 0; day < days; day++) {
    let dailyEnergy = 0;
    const startIdx = day * intervalsPerDay;
    const endIdx = Math.min(startIdx + intervalsPerDay, powerHistory.length);

    for (let i = startIdx; i < endIdx; i++) {
      // Energy = Power * Time (in hours)
      const energyInInterval = powerHistory[i] * (intervalMinutes / 60);
      dailyEnergy += energyInInterval;
    }
    dailyEnergies.push(dailyEnergy);
  }

  // Calculate statistics
  if (dailyEnergies.length === 0) {
    throw new Error("Cannot calculate daily statistics: no data points");
  }
  const avgEnergy =
    dailyEnergies.reduce((sum, e) => sum + e, 0) / dailyEnergies.length;
  const maxEnergy = Math.max(...dailyEnergies);
  const minEnergy = Math.min(...dailyEnergies);

  // Create chart data with interval position within a day (0 to intervalsPerDay-1)
  // We'll show the average pattern across all days
  const intervalDataPoints: IntervalDataPoint[] = [];

  for (let intervalPos = 0; intervalPos < intervalsPerDay; intervalPos++) {
    const intervalEnergies: number[] = [];

    // Calculate energy delivered for this interval position across all days
    for (let day = 0; day < days; day++) {
      const globalIdx = day * intervalsPerDay + intervalPos;
      if (globalIdx < powerHistory.length) {
        const power = powerHistory[globalIdx];
        const energy = power * (intervalMinutes / 60);
        intervalEnergies.push(energy);
      }
    }

    if (intervalEnergies.length > 0) {
      const avg =
        intervalEnergies.reduce((sum, e) => sum + e, 0) /
        intervalEnergies.length;
      const max = Math.max(...intervalEnergies);
      const min = Math.min(...intervalEnergies);

      // Calculate time label for this interval
      const totalMinutes = intervalPos * intervalMinutes;
      const hours = Math.floor(totalMinutes / 60);
      const minutes = totalMinutes % 60;
      const timeLabel = `${hours.toString().padStart(2, "0")}:${minutes
        .toString()
        .padStart(2, "0")}`;

      intervalDataPoints.push({
        interval: intervalPos,
        time: timeLabel,
        avg,
        max,
        min,
      });
    }
  }

  return {
    dailyStats: {
      avg: avgEnergy,
      max: maxEnergy,
      min: minEnergy,
    },
    intervalDataPoints,
    totalIntervals: intervalDataPoints.length,
    intervalMinutes,
  };
}
