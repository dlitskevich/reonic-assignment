import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ParameterInput } from "../ParameterInput";
import { SimulationParameters } from "../../types";

// Mock the ChargepointConfigSection component
jest.mock("../ChargepointConfig", () => ({
  ChargepointConfigSection: ({
    chargepoints,
    onChargepointsChange,
    isRunning,
  }: any) => (
    <div data-testid="chargepoint-config">
      <div>Chargepoints: {chargepoints.length}</div>
      <button
        onClick={() =>
          onChargepointsChange([...chargepoints, { count: 1, powerKw: 11.0 }])
        }
        disabled={isRunning}
      >
        Add Chargepoint
      </button>
    </div>
  ),
}));

// Mock the RangeSlider component
jest.mock("../RangeSlider/RangeSlider", () => ({
  RangeSlider: ({
    id,
    label,
    value,
    onChange,
    disabled,
    valueDisplay,
  }: any) => (
    <div data-testid={`range-slider-${id}`}>
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        type="range"
        min="0"
        max="100"
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        disabled={disabled}
        data-testid={`slider-${id}`}
      />
      {valueDisplay && <span>{valueDisplay}</span>}
    </div>
  ),
}));

describe("ParameterInput", () => {
  const defaultParameters: SimulationParameters = {
    chargepoints: [{ count: 2, powerKw: 11.0 }],
    consumptionKwhPer100km: 20.5,
    days: 7,
    intervalMinutes: 15,
    arrivalProbabilityMultiplier: 100,
  };

  const defaultProps = {
    parameters: defaultParameters,
    onParametersChange: jest.fn(),
    onRunSimulation: jest.fn(),
    isRunning: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render all input fields", () => {
    render(<ParameterInput {...defaultProps} />);

    expect(screen.getByLabelText(/Vehicle Consumption/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Simulation Duration/i)).toBeInTheDocument();
    expect(screen.getByText(/Interval/i)).toBeInTheDocument();
    expect(
      screen.getByText(/Arrival Probability Multiplier/i)
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Run Simulation/i })
    ).toBeInTheDocument();
  });

  it("should display current parameter values", () => {
    render(<ParameterInput {...defaultProps} />);

    const consumptionInput = screen.getByLabelText(
      /Vehicle Consumption/i
    ) as HTMLInputElement;
    const daysInput = screen.getByLabelText(
      /Simulation Duration/i
    ) as HTMLInputElement;

    expect(consumptionInput.value).toBe("20.5");
    expect(daysInput.value).toBe("7");
  });

  it("should call onParametersChange when consumption value changes", async () => {
    const user = userEvent.setup();
    const onParametersChange = jest.fn();
    render(
      <ParameterInput
        {...defaultProps}
        onParametersChange={onParametersChange}
      />
    );

    const consumptionInput = screen.getByLabelText(/Vehicle Consumption/i);
    await user.clear(consumptionInput);
    await user.type(consumptionInput, "25");

    // Check that onChange was called with the new value (may be called multiple times during typing)
    expect(onParametersChange).toHaveBeenCalled();
    // Check that at least one call has a valid number (not NaN or the original value)
    const hasNewValue = onParametersChange.mock.calls.some(
      (call) =>
        !isNaN(call[0].consumptionKwhPer100km) &&
        call[0].consumptionKwhPer100km !==
          defaultParameters.consumptionKwhPer100km
    );
    expect(hasNewValue).toBe(true);
  });

  it("should call onParametersChange when days value changes", async () => {
    const user = userEvent.setup();
    const onParametersChange = jest.fn();
    render(
      <ParameterInput
        {...defaultProps}
        onParametersChange={onParametersChange}
      />
    );

    const daysInput = screen.getByLabelText(/Simulation Duration/i);
    await user.clear(daysInput);
    await user.type(daysInput, "14");

    // Check that onChange was called with the new value (may be called multiple times during typing)
    expect(onParametersChange).toHaveBeenCalled();
    // Check that at least one call has a valid number (not NaN or the original value)
    const hasNewValue = onParametersChange.mock.calls.some(
      (call) => !isNaN(call[0].days) && call[0].days !== defaultParameters.days
    );
    expect(hasNewValue).toBe(true);
  });

  it("should call onRunSimulation when button is clicked", async () => {
    const user = userEvent.setup();
    const onRunSimulation = jest.fn();
    render(
      <ParameterInput {...defaultProps} onRunSimulation={onRunSimulation} />
    );

    const runButton = screen.getByRole("button", { name: /Run Simulation/i });
    await user.click(runButton);

    expect(onRunSimulation).toHaveBeenCalledTimes(1);
  });

  it("should disable inputs when isRunning is true", () => {
    render(<ParameterInput {...defaultProps} isRunning={true} />);

    const consumptionInput = screen.getByLabelText(/Vehicle Consumption/i);
    const daysInput = screen.getByLabelText(/Simulation Duration/i);
    const runButton = screen.getByRole("button", {
      name: /Running Simulation/i,
    });

    expect(consumptionInput).toBeDisabled();
    expect(daysInput).toBeDisabled();
    expect(runButton).toBeDisabled();
  });

  it('should show "Running Simulation..." text when isRunning is true', () => {
    render(<ParameterInput {...defaultProps} isRunning={true} />);

    expect(
      screen.getByRole("button", { name: /Running Simulation/i })
    ).toBeInTheDocument();
  });

  it("should render ChargepointConfigSection with correct props", () => {
    render(<ParameterInput {...defaultProps} />);

    const chargepointConfig = screen.getByTestId("chargepoint-config");
    expect(chargepointConfig).toBeInTheDocument();
    expect(chargepointConfig).toHaveTextContent("Chargepoints: 1");
  });

  it("should render RangeSlider components with correct props", () => {
    render(<ParameterInput {...defaultProps} />);

    const intervalSlider = screen.getByTestId("range-slider-interval");
    const arrivalSlider = screen.getByTestId("range-slider-arrivalMultiplier");

    expect(intervalSlider).toBeInTheDocument();
    expect(arrivalSlider).toBeInTheDocument();
  });
});
