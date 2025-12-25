import { RunSimulationMutation } from "../types/__generated__/graphql";

type ChargepointUtilization =
  RunSimulationMutation["runSimulation"]["chargepointUtilizations"][number];

interface ChargepointUtilizationDisplayProps {
  results: RunSimulationMutation["runSimulation"];
}

export const ChargepointUtilizationDisplay = ({
  results,
}: ChargepointUtilizationDisplayProps) => {
  const utilizations = results.chargepointUtilizations || [];

  if (utilizations.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Chargepoint Utilization
        </h2>
        <p className="text-gray-600">No utilization data available</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-2">
        Chargepoint Utilization
      </h2>
      <p className="text-sm text-gray-600 mb-6">
        Utilization statistics per chargepoint type
      </p>

      <SummaryCards utilizations={utilizations} />
      <UtilizationTable utilizations={utilizations} />
    </div>
  );
};

const SummaryCards = ({
  utilizations,
}: {
  utilizations: ChargepointUtilization[];
}) => {
  return (
    <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
        <div className="text-sm text-blue-600 font-medium mb-1">
          Average Utilization
        </div>
        <div className="text-2xl font-bold text-blue-800">
          {(
            utilizations.reduce((sum, u) => sum + u.utilization, 0) /
            utilizations.length
          ).toFixed(1)}
          %
        </div>
      </div>
      <div className="bg-green-50 rounded-lg p-4 border border-green-200">
        <div className="text-sm text-green-600 font-medium mb-1">
          Average Daily Events (All)
        </div>
        <div className="text-2xl font-bold text-green-800">
          {utilizations
            .reduce((sum, u) => sum + u.avgDailyEvents, 0)
            .toFixed(0)}
        </div>
      </div>
      <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
        <div className="text-sm text-purple-600 font-medium mb-1">
          Average Daily Energy (All)
        </div>
        <div className="text-2xl font-bold text-purple-800">
          {utilizations
            .reduce((sum, u) => sum + u.avgDailyEnergyKwh, 0)
            .toFixed(0)}{" "}
          kWh
        </div>
      </div>
    </div>
  );
};

const UtilizationTable = ({
  utilizations,
}: {
  utilizations: ChargepointUtilization[];
}) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Power (kW)
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Utilization
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Daily Events
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Daily Energy
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Monthly Events
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Monthly Energy
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {utilizations.map((util, index) => (
            <tr
              key={index}
              className="hover:bg-gray-50 transition-colors duration-150"
            >
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-semibold text-gray-900">
                  {util.powerKw.toFixed(1)} kW
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-900">
                      {util.utilization.toFixed(1)}%
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{
                          width: `${Math.min(util.utilization, 100)}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">
                  {util.avgDailyEvents.toFixed(1)}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">
                  {util.avgDailyEnergyKwh.toFixed(1)} kWh
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">
                  {util.avgMonthlyEvents.toFixed(0)}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">
                  {util.avgMonthlyEnergyKwh.toFixed(0)} kWh
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
