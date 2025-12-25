import { RunSimulationMutation } from "../types/__generated__/graphql";

interface StatisticsDisplayProps {
  results: RunSimulationMutation["runSimulation"];
}

export const StatisticsDisplay = ({ results }: StatisticsDisplayProps) => {
  const stats = [
    {
      label: "Total Energy Delivered",
      // toLocaleString is used to format the number with the thousands separator
      value: `${results.totalEnergyKwh.toLocaleString(undefined, {
        maximumFractionDigits: 0,
      })} kWh`,
    },
    {
      label: "Maximum Power Draw",
      value: `${results.maxPowerKw.toFixed(0)} kW`,
    },
    {
      label: "Max Theoretical Power",
      value: `${results.maxTheoreticalPowerKw.toFixed(0)} kW`,
    },
    {
      label: "Concurrency Factor",
      value: `${(results.concurrencyFactor * 100).toFixed(0)}%`,
      highlight: true,
    },
  ];

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Simulation Statistics
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div
            key={index}
            className={`p-4 rounded-lg border-2 ${
              stat.highlight
                ? "border-blue-500 bg-blue-50"
                : "border-gray-200 bg-gray-50"
            }`}
          >
            <div className="flex justify-between items-top">
              <div className="text-sm text-gray-600 mb-1">{stat.label}</div>
              {stat.highlight && (
                <div className="mb-2 width-fit bg-blue-100 rounded text-center px-2">
                  <span className="text-xs font-semibold text-blue-600">
                    KEY METRIC
                  </span>
                </div>
              )}
            </div>
            <div
              className={`text-2xl font-bold ${
                stat.highlight ? "text-blue-700" : "text-gray-800"
              }`}
            >
              {stat.value}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
