export type ChargepointConfig = {
  count: number;
  powerKw: number;
};

export type SimulationParameters = {
  chargepoints: ChargepointConfig[];
  consumptionKwhPer100km: number;
  days: number;
  intervalMinutes: number;
  arrivalProbabilityMultiplier: number; // Percentage (20-200%, default: 100%)
};

export type SimulationResults = {
  totalEnergyKwh: number;
  maxPowerKw: number;
  maxTheoreticalPowerKw: number;
  concurrencyFactor: number;
  powerHistory: number[];
};
