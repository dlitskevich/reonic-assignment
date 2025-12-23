import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { SimulationResults } from "../types";

type AggregatedDailyDataChartProps = {
  results: SimulationResults;
};

export const AggregatedDailyDataChart = ({
  results,
}: AggregatedDailyDataChartProps) => {
  // Use the first daily data entry (aggregated across all days)
  const dailyData = results.aggregatedDailyData;

  if (!dailyData) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <p className="text-gray-600">No data available</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-2">
        Daily Energy Delivery Pattern
      </h2>
      <p className="text-sm text-gray-600 mb-6">
        Average, maximum, and minimum energy delivered per{" "}
        {dailyData.intervalMinutes}
        -minute interval across all days
      </p>

      {/* Daily Statistics Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
          <div className="text-sm text-blue-600 font-medium mb-1">
            Average Daily Energy
          </div>
          <div className="text-2xl font-bold text-blue-800">
            {dailyData.dailyStats.avg.toFixed(0)} kWh
          </div>
        </div>
        <div className="bg-green-50 rounded-lg p-4 border border-green-200">
          <div className="text-sm text-green-600 font-medium mb-1">
            Maximum Daily Energy
          </div>
          <div className="text-2xl font-bold text-green-800">
            {dailyData.dailyStats.max.toFixed(0)} kWh
          </div>
        </div>
        <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
          <div className="text-sm text-orange-600 font-medium mb-1">
            Minimum Daily Energy
          </div>
          <div className="text-2xl font-bold text-orange-800">
            {dailyData.dailyStats.min.toFixed(0)} kWh
          </div>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={400}>
        <LineChart
          data={dailyData.intervalDataPoints}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis
            dataKey="time"
            label={{
              value: "Time of Day",
              position: "insideBottom",
              offset: 10,
            }}
            stroke="#6b7280"
            angle={-45}
            textAnchor="end"
            height={80}
            interval="preserveStartEnd"
          />
          <YAxis
            label={{
              value: "Energy (kWh)",
              angle: -90,
              position: "insideLeft",
            }}
            stroke="#6b7280"
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#fff",
              border: "1px solid #e5e7eb",
              borderRadius: "8px",
            }}
            formatter={(value: number, name: string) => {
              const label =
                name === "Average"
                  ? "Average"
                  : name === "Maximum"
                  ? "Maximum"
                  : "Minimum";
              return [`${value.toFixed(1)} kWh`, label];
            }}
            labelFormatter={(time) => `Time: ${time}`}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="avg"
            stroke="#3b82f6"
            strokeWidth={2}
            dot={false}
            name="Average"
          />
          <Line
            type="monotone"
            dataKey="max"
            stroke="#10b981"
            strokeWidth={2}
            dot={false}
            strokeDasharray="5 5"
            name="Maximum"
          />
          <Line
            type="monotone"
            dataKey="min"
            stroke="#f59e0b"
            strokeWidth={2}
            dot={false}
            strokeDasharray="5 5"
            name="Minimum"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
