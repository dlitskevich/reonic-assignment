import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { PowerHistogramDataPoint, SimulationResults } from "../types";

const CustomTooltip = ({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{
    payload: PowerHistogramDataPoint;
  }>;
  label?: number | string;
}) => {
  if (active && payload) {
    const data = payload[0].payload;
    return (
      <div className="bg-white border border-gray-300 rounded-lg shadow-lg p-3">
        <p className="font-semibold text-gray-800 mb-2">
          Power level: {typeof label === "number" ? label.toFixed(0) : label} kW
        </p>
        <p className="text-sm text-gray-600">
          <span className="font-medium">Percentage:</span>{" "}
          {data.percentage.toFixed(1)}%
        </p>
        <p className="text-sm text-gray-600">
          <span className="font-medium">Occurrences:</span>{" "}
          {data.count.toFixed(0)}
        </p>
      </div>
    );
  }
  return null;
};

type PowerDistributionChartProps = {
  results: SimulationResults;
};

export const PowerDistributionChart = ({
  results,
}: PowerDistributionChartProps) => {
  // Use power histogram data directly
  const histogramData = results.powerHistogram;

  if (histogramData.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <p className="text-gray-600">No histogram data available</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Power Distribution Histogram
      </h2>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart
          data={histogramData}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis
            height={60}
            dataKey="maxPowerKw"
            stroke="#6b7280"
            tickFormatter={(value) => value.toFixed(0)}
            label={{
              value: "Power (kW)",
              position: "insideBottom",
              offset: 10,
            }}
          />
          <YAxis
            label={{
              value: "Percentage (%)",
              angle: -90,
              position: "insideLeft",
            }}
            stroke="#6b7280"
            domain={[0, "auto"]}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend verticalAlign="bottom" height={36} />
          <Bar dataKey="percentage" fill="#3b82f6" name="Percentage" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
