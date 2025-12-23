import { SimulationParameters } from "./types";

export const DEFAULT_SIMULATION_PARAMETERS: SimulationParameters = {
  chargepoints: [
    { count: 5, powerKw: 11.0 },
    { count: 3, powerKw: 22.0 },
    { count: 1, powerKw: 50.0 },
  ],
  consumptionKwhPer100km: 18.0,
  days: 365,
  intervalMinutes: 15,
  arrivalProbabilityMultiplier: 100,
};
