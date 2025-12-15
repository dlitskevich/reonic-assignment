import { ChargepointConfig, SimulationParameters } from "../types";
import { ChargepointConfigSection } from "./ChargepointConfig";
import { RangeSlider } from "./RangeSlider/RangeSlider";

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
                parseFloat(e.target.value) || 1
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

        <RangeSlider
          id="interval"
          label="Interval (minutes)"
          value={parameters.intervalMinutes}
          min={5}
          max={20}
          step={5}
          onChange={(value) => handleChange("intervalMinutes", value || 5)}
          disabled={isRunning}
          valueDisplay={`${parameters.intervalMinutes} minutes`}
        />

        <RangeSlider
          id="arrivalMultiplier"
          label="Arrival Probability Multiplier"
          value={parameters.arrivalProbabilityMultiplier}
          min={20}
          max={200}
          step={1}
          onChange={(value) =>
            handleChange("arrivalProbabilityMultiplier", value || 100)
          }
          disabled={isRunning}
          valueDisplay={`${parameters.arrivalProbabilityMultiplier}%`}
          minLabel="20%"
          maxLabel="200%"
          description="Changes the probability of a car arriving"
        />
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
