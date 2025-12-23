export type IntervalDataPoint = {
  interval: number;
  time: string;
  avg: number;
  max: number;
  min: number;
};

export type AggregatedDailyData = {
  dailyStats: {
    avg: number;
    max: number;
    min: number;
  };
  intervalDataPoints: IntervalDataPoint[];
  totalIntervals: number;
  intervalMinutes: number;
};

export type PowerHistogramDataPoint = {
  maxPowerKw: number;
  count: number;
  percentage: number;
};

export type ChargepointConfig = {
  count: number;
  powerKw: number;
};

export type ChargepointUtilization = {
  powerKw: number;
  utilization: number;
  avgDailyEvents: number;
  avgDailyEnergyKwh: number;
  avgMonthlyEvents: number;
  avgMonthlyEnergyKwh: number;
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
  aggregatedDailyData: AggregatedDailyData;
  powerHistogram: PowerHistogramDataPoint[];
  chargepointUtilizations: ChargepointUtilization[];
};
