export type IntervalDataPoint = {
  interval: number;
  time: string;
  avg: number;
  max: number;
  min: number;
};

export type DailyData = {
  dailyStats: {
    avg: number;
    max: number;
    min: number;
  };
  intervalData: IntervalDataPoint[];
  totalIntervals: number;
};

/**
 * Calculates daily energy statistics and interval data from power history.
 *
 * @param powerHistory - Array of power values (kW) for each interval
 * @param intervalMinutes - Duration of each interval in minutes
 * @returns Daily statistics and sampled interval data for charting
 */
export function calculateDailyData(
  powerHistory: number[],
  intervalMinutes: number
): DailyData {
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
  const avgEnergy =
    dailyEnergies.reduce((sum, e) => sum + e, 0) / dailyEnergies.length;
  const maxEnergy = Math.max(...dailyEnergies);
  const minEnergy = Math.min(...dailyEnergies);

  // Create chart data with interval position within a day (0 to intervalsPerDay-1)
  // We'll show the average pattern across all days
  const intervalData: IntervalDataPoint[] = [];

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

      intervalData.push({
        interval: intervalPos,
        time: timeLabel,
        avg,
        max,
        min,
      });
    }
  }

  // Sample data if there are too many intervals to avoid overwhelming the chart
  const maxDataPoints = 200;
  const sampleRate =
    intervalData.length > maxDataPoints
      ? Math.ceil(intervalData.length / maxDataPoints)
      : 1;

  const sampledData = intervalData.filter(
    (_, index) => index % sampleRate === 0
  );

  return {
    dailyStats: {
      avg: avgEnergy,
      max: maxEnergy,
      min: minEnergy,
    },
    intervalData: sampledData,
    totalIntervals: intervalData.length,
  };
}
