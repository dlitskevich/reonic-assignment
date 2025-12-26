/**
 * Helper function to transform chargepoints to GraphQL format
 */
export function transformChargepoints(
  chargepoints: Array<{ count: number; powerKw: number }>
) {
  return chargepoints.map((cp) => ({
    count: cp.count,
    powerKw: cp.powerKw,
  }));
}

/**
 * Helper function to transform simulation parameter to GraphQL format
 */
export function transformSimulationParameter(param: {
  id: number;
  chargepoints: Array<{ count: number; powerKw: number }>;
  consumptionKwhPer100km: number;
  days: number;
  intervalMinutes: number;
  arrivalProbabilityMultiplier: number;
  createdAt: Date;
  updatedAt: Date;
}) {
  return {
    ...param,
    chargepoints: transformChargepoints(param.chargepoints),
    createdAt: param.createdAt.toISOString(),
    updatedAt: param.updatedAt.toISOString(),
  };
}
