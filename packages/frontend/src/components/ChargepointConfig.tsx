import { ChargepointConfigInput } from "../types/__generated__/graphql";

type ChargepointConfigProps = {
  chargepoints: ChargepointConfigInput[];
  onChargepointsChange: (chargepoints: ChargepointConfigInput[]) => void;
  isRunning?: boolean;
};

export const ChargepointConfigSection = ({
  chargepoints,
  onChargepointsChange,
  isRunning = false,
}: ChargepointConfigProps) => {
  const addChargepointType = () => {
    onChargepointsChange([...chargepoints, { count: 1, powerKw: 11.0 }]);
  };

  const removeChargepointType = (index: number) => {
    if (chargepoints.length > 1) {
      onChargepointsChange(chargepoints.filter((_, i) => i !== index));
    }
  };

  const updateChargepoint = (
    index: number,
    field: keyof ChargepointConfigInput,
    value: number
  ) => {
    const updated = [...chargepoints];
    updated[index] = { ...updated[index], [field]: value };
    onChargepointsChange(updated);
  };

  const totalChargepoints = chargepoints.reduce(
    (sum, chargepoint) => sum + chargepoint.count,
    0
  );
  const maxTheoreticalPower = chargepoints.reduce(
    (sum, chargepoint) => sum + chargepoint.count * chargepoint.powerKw,
    0
  );

  return (
    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-base font-semibold text-gray-800">Chargepoints</h3>
        <button
          type="button"
          onClick={addChargepointType}
          disabled={isRunning}
          className="px-3 py-1.5 bg-green-600 text-white text-xs font-medium rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          + Add
        </button>
      </div>

      <div className="space-y-2 mb-3">
        {chargepoints.map((chargepoint, index) => (
          <div
            key={index}
            className="flex items-center gap-2 p-2 bg-white rounded-md border border-gray-300"
          >
            <div className="flex-1 grid grid-cols-2 gap-2">
              <div>
                <label
                  htmlFor={`chargepoint-count-${index}`}
                  className="block text-xs font-medium text-gray-700 mb-1"
                >
                  Count
                </label>
                <input
                  id={`chargepoint-count-${index}`}
                  type="number"
                  min="1"
                  max="100"
                  value={chargepoint.count}
                  onChange={(e) =>
                    updateChargepoint(
                      index,
                      "count",
                      parseInt(e.target.value) || 1
                    )
                  }
                  className="w-full px-2 py-1.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  disabled={isRunning}
                />
              </div>
              <div>
                <label
                  htmlFor={`chargepoint-power-${index}`}
                  className="block text-xs font-medium text-gray-700 mb-1"
                >
                  Power (kW)
                </label>
                <input
                  id={`chargepoint-power-${index}`}
                  type="number"
                  min="1"
                  max="200"
                  step="0.1"
                  value={chargepoint.powerKw}
                  onChange={(e) =>
                    updateChargepoint(
                      index,
                      "powerKw",
                      parseFloat(e.target.value) || 1
                    )
                  }
                  className="w-full px-2 py-1.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  disabled={isRunning}
                />
              </div>
            </div>
            <div className="flex items-end">
              <button
                type="button"
                onClick={() => removeChargepointType(index)}
                disabled={isRunning || chargepoints.length === 1}
                className="px-2 py-1.5 bg-red-600 text-white text-xs font-medium rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                aria-label="Remove chargepoint type"
              >
                ×
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="pt-3 border-t border-gray-300">
        <div className="space-y-1 text-xs">
          <div className="flex justify-between">
            <span className="text-gray-600">Total:</span>
            <span className="font-semibold text-gray-800">
              {totalChargepoints} chargepoints
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Max Power:</span>
            <span className="font-semibold text-gray-800">
              {maxTheoreticalPower.toFixed(1)} kW
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
