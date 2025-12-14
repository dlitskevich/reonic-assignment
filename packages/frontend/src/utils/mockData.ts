import { SimulationParameters, SimulationResults } from "../types";

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

  return {
    totalEnergyKwh: totalEnergy,
    maxPowerKw: maxPower,
    maxTheoreticalPowerKw: maxTheoreticalPower,
    concurrencyFactor,
    powerHistory,
  };
}
