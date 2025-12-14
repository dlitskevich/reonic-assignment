import { useMemo } from "react";
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
import { SimulationResults } from "../types";

type PowerDistributionChartProps = {
  results: SimulationResults;
};

export const PowerDistributionChart = ({
  results,
}: PowerDistributionChartProps) => {
  // Create histogram data for power distribution
  const histogramData = useMemo(() => {
    const bins = 20;
    const maxPower = results.maxTheoreticalPowerKw;
    const binSize = maxPower / bins;
    const binsCount = new Array(bins).fill(0);

    results.powerHistory.forEach((power) => {
      const binIndex = Math.min(Math.floor(power / binSize), bins - 1);
      binsCount[binIndex]++;
    });

    return binsCount.map((count, index) => ({
      powerRange: `${(index * binSize).toFixed(0)}-${(
        (index + 1) *
        binSize
      ).toFixed(0)} kW`,
      count: count,
      percentage: (count / results.powerHistory.length) * 100,
    }));
  }, [results.powerHistory, results.maxTheoreticalPowerKw]);

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
            dataKey="powerRange"
            angle={-45}
            textAnchor="end"
            height={100}
            stroke="#6b7280"
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
          <Tooltip
            contentStyle={{
              backgroundColor: "#fff",
              border: "1px solid #e5e7eb",
              borderRadius: "8px",
            }}
            formatter={(value: number, name: string) => {
              if (name === "percentage") {
                return [`${value.toFixed(2)}%`, "Percentage"];
              }
              return [value, "Occurrences"];
            }}
          />
          <Legend />
          <Bar dataKey="percentage" fill="#3b82f6" name="Distribution" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
