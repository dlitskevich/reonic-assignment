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
  intervalData: IntervalDataPoint[];
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
  aggregated_daily_data: AggregatedDailyData;
  power_histogram: PowerHistogramDataPoint[];
};
