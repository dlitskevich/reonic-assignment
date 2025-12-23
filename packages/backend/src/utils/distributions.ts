/**
 * Probability distributions for EV arrival and charging needs.
 */

/**
 * Calculate arrival probability (within 1 hour interval) T1 for a given hour of the day.
 *
 * @param hour - Hour of the day (0-23)
 * @returns Probability of arrival (0.0 to 1.0)
 */
export function arrivalProbability(hour: number): number {
  if (hour >= 0 && hour < 8) {
    return 0.0094;
  }
  if (hour < 10) {
    return 0.0283;
  }
  if (hour < 13) {
    return 0.0566;
  }
  if (hour < 16) {
    return 0.0755;
  }
  if (hour < 19) {
    return 0.1038;
  }
  if (hour < 22) {
    return 0.0472;
  }
  if (hour < 24) {
    return 0.0094;
  }
  throw new Error(`Invalid hour: ${hour}`);
}

/**
 * Weighted random choice function (equivalent to np.random.choice with probabilities).
 *
 * @param items - Array of items to choose from
 * @param probabilities - Array of probabilities corresponding to each item
 * @returns Selected item
 */
function weightedChoice<T>(items: T[], probabilities: number[]): T {
  // Normalize probabilities
  const sum = probabilities.reduce((acc, p) => acc + p, 0);
  const normalizedProbs = probabilities.map((p) => p / sum);

  // Create cumulative distribution
  const cumulative: number[] = [];
  let cumulativeSum = 0;
  for (const prob of normalizedProbs) {
    cumulativeSum += prob;
    cumulative.push(cumulativeSum);
  }

  // Generate random number and find corresponding item
  const random = Math.random();
  for (let i = 0; i < cumulative.length; i++) {
    if (random < cumulative[i]) {
      return items[i];
    }
  }

  // Fallback to last item (shouldn't happen due to floating point, but for safety)
  return items[items.length - 1];
}

/**
 * Sample charging needs based on vehicle consumption.
 *
 * @returns Sampled distance in km
 */
export function sampleChargingNeedsKm(): number {
  const km = [0, 5, 10, 20, 30, 50, 100, 200, 300];
  const probabilities = [
    0.3431, 0.049, 0.098, 0.1176, 0.0882, 0.1176, 0.1078, 0.049, 0.0294,
  ];

  return weightedChoice(km, probabilities);
}

/**
 * Sample charging energy based on vehicle consumption.
 *
 * @param consumptionKwhPer100km - Vehicle consumption in kWh per 100km (default: 18)
 * @returns Sampled energy in kWh
 */
export function sampleChargingEnergy(
  consumptionKwhPer100km: number = 18.0
): number {
  return (sampleChargingNeedsKm() / 100) * consumptionKwhPer100km;
}

/**
 * Sample whether an arrival occurs in a given hour.
 *
 * Note: doesn't account for the intervals spanning multiple hours.
 *
 * @param hour - Hour of the day (0-23)
 * @param intervalMinutes - Length of the interval in minutes
 * @param arrivalMultiplier - Multiplier for the arrival probability
 * @returns True if arrival occurs, False otherwise
 */
export function sampleArrival(
  hour: number,
  intervalMinutes: number,
  arrivalMultiplier: number
): boolean {
  const probability = arrivalProbability(hour);
  const adjustedProbability =
    probability * (intervalMinutes / 60) * arrivalMultiplier;
  return Math.random() < adjustedProbability;
}
