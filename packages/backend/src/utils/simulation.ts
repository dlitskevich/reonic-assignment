import {
  SimulationParameters,
  SimulationResults,
  PowerHistogramDataPoint,
  AggregatedDailyData,
  IntervalDataPoint,
} from "./types";

/**
 * Calculates daily energy statistics and interval data from power history.
 */
function calculateDailyData(
  powerHistory: number[],
  intervalMinutes: number
): AggregatedDailyData {
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

/**
 * Generates mock simulation results based on the provided parameters.
 * This simulates realistic EV charging station behavior.
 */
export function generateMockResults(
  params: SimulationParameters
): SimulationResults {
  const totalIntervals = Math.ceil(
    (params.days * 24 * 60) / params.intervalMinutes
  );

  // Calculate max theoretical power from all chargepoint types
  const maxTheoreticalPower = params.chargepoints.reduce(
    (sum, chargepoint) => sum + chargepoint.count * chargepoint.powerKw,
    0
  );

  // Create a flat array of chargepoint powers for easier simulation
  const chargepointPowers: number[] = [];
  params.chargepoints.forEach((chargepoint) => {
    for (let i = 0; i < chargepoint.count; i++) {
      chargepointPowers.push(chargepoint.powerKw);
    }
  });

  // Generate power history with realistic patterns
  const powerHistory: number[] = [];
  let totalEnergy = 0;

  // Convert multiplier from percentage to factor (100% = 1.0, 200% = 2.0, etc.)
  const arrivalMultiplier = params.arrivalProbabilityMultiplier / 100;

  for (let i = 0; i < totalIntervals; i++) {
    const hour = ((i * params.intervalMinutes) / 60) % 24;

    // Simulate daily patterns: higher demand during morning (7-9) and evening (17-20)
    let baseDemand = 0.3;
    if (hour >= 7 && hour < 9) {
      baseDemand = 0.7; // Morning rush
    } else if (hour >= 17 && hour < 20) {
      baseDemand = 0.8; // Evening rush
    } else if (hour >= 22 || hour < 6) {
      baseDemand = 0.2; // Low demand at night
    }

    // Apply arrival probability multiplier
    baseDemand = Math.min(baseDemand * arrivalMultiplier, 1.0);

    // Add some randomness
    const randomFactor = 0.7 + Math.random() * 0.6; // 0.7 to 1.3
    const demandFactor = baseDemand * randomFactor;

    // Calculate power demand based on chargepoint utilization
    // Simulate which chargepoints are in use based on demand factor
    let powerDemand = 0;
    const utilizationRate = demandFactor;

    chargepointPowers.forEach((power) => {
      // Each chargepoint has a chance to be in use based on utilization rate
      if (Math.random() < utilizationRate) {
        powerDemand += power;
      }
    });

    // Clamp to max theoretical power
    powerDemand = Math.min(powerDemand, maxTheoreticalPower);

    powerHistory.push(powerDemand);

    // Calculate energy delivered (simplified: power * time in hours)
    const energyInInterval = powerDemand * (params.intervalMinutes / 60);
    totalEnergy += energyInInterval;
  }

  const maxPower = Math.max(...powerHistory);
  const concurrencyFactor = maxPower / maxTheoreticalPower;

  // Calculate daily energy history
  const aggregatedDailyData = calculateDailyData(
    powerHistory,
    params.intervalMinutes
  );

  // Calculate power histogram
  const bins = 20;
  const binSize = maxTheoreticalPower / bins;
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

  return {
    totalEnergyKwh: totalEnergy,
    maxPowerKw: maxPower,
    maxTheoreticalPowerKw: maxTheoreticalPower,
    concurrencyFactor,
    aggregatedDailyData,
    powerHistogram,
  };
}
