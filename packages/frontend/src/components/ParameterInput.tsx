import { ChargepointConfig, SimulationParameters } from "../types";
import { ChargepointConfigSection } from "./ChargepointConfig";

interface ParameterInputProps {
  parameters: SimulationParameters;
  onParametersChange: (params: SimulationParameters) => void;
  onRunSimulation: () => void;
  isRunning?: boolean;
}

export const ParameterInput = ({
  parameters,
  onParametersChange,
  onRunSimulation,
  isRunning = false,
}: ParameterInputProps) => {
  const handleChange = (field: keyof SimulationParameters, value: number) => {
    onParametersChange({
      ...parameters,
      [field]: value,
    });
  };

  const handleChargepointsChange = (chargepoints: ChargepointConfig[]) => {
    onParametersChange({
      ...parameters,
      chargepoints,
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <ChargepointConfigSection
          chargepoints={parameters.chargepoints}
          onChargepointsChange={handleChargepointsChange}
          isRunning={isRunning}
        />
      </div>

      <div className="space-y-4">
        <div>
          <label
            htmlFor="consumption"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Vehicle Consumption (kWh/100km)
          </label>
          <input
            id="consumption"
            type="number"
            min="1"
            max="50"
            step="0.1"
            value={parameters.consumptionKwhPer100km}
            onChange={(e) =>
              handleChange(
                "consumptionKwhPer100km",
                parseFloat(e.target.value) || 0
              )
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            disabled={isRunning}
          />
        </div>

        <div>
          <label
            htmlFor="days"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Simulation Duration (days)
          </label>
          <input
            id="days"
            type="number"
            min="1"
            max="3650"
            value={parameters.days}
            onChange={(e) =>
              handleChange("days", parseInt(e.target.value) || 1)
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            disabled={isRunning}
          />
        </div>

        <div>
          <label
            htmlFor="interval"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Interval (minutes)
          </label>
          <input
            id="interval"
            type="number"
            min="1"
            max="60"
            step="1"
            value={parameters.intervalMinutes}
            onChange={(e) =>
              handleChange("intervalMinutes", parseInt(e.target.value) || 1)
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            disabled={isRunning}
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label
              htmlFor="arrivalMultiplier"
              className="block text-sm font-medium text-gray-700"
            >
              Arrival Probability Multiplier
            </label>
            <span className="text-sm font-semibold text-blue-600">
              {parameters.arrivalProbabilityMultiplier}%
            </span>
          </div>
          <input
            id="arrivalMultiplier"
            type="range"
            min="20"
            max="200"
            step="1"
            value={parameters.arrivalProbabilityMultiplier}
            onChange={(e) =>
              handleChange(
                "arrivalProbabilityMultiplier",
                parseFloat(e.target.value) || 100
              )
            }
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
            style={{
              background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${
                ((parameters.arrivalProbabilityMultiplier - 20) / (200 - 20)) *
                100
              }%, #e5e7eb ${
                ((parameters.arrivalProbabilityMultiplier - 20) / (200 - 20)) *
                100
              }%, #e5e7eb 100%)`,
            }}
            disabled={isRunning}
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>20%</span>
            <span>200%</span>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Controls how many cars arrive to charge (default: 100%)
          </p>
        </div>
      </div>

      <button
        onClick={onRunSimulation}
        disabled={isRunning}
        className="w-full px-4 py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors text-sm"
      >
        {isRunning ? "Running Simulation..." : "Run Simulation"}
      </button>
    </div>
  );
};
