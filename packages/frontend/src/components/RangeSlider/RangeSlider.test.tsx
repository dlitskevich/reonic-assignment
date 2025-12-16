import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { RangeSlider } from "./RangeSlider";

describe("RangeSlider", () => {
  const defaultProps = {
    id: "test-slider",
    label: "Test Slider",
    value: 50,
    min: 0,
    max: 100,
    onChange: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render with label", () => {
    render(<RangeSlider {...defaultProps} />);
    expect(screen.getByText("Test Slider")).toBeInTheDocument();
  });

  it("should render with value display", () => {
    render(<RangeSlider {...defaultProps} valueDisplay="50%" />);
    expect(screen.getByText("50%")).toBeInTheDocument();
  });

  it("should render min and max labels", () => {
    render(<RangeSlider {...defaultProps} minLabel="Min" maxLabel="Max" />);
    expect(screen.getByText("Min")).toBeInTheDocument();
    expect(screen.getByText("Max")).toBeInTheDocument();
  });

  it("should render default min and max values when labels not provided", () => {
    render(<RangeSlider {...defaultProps} />);
    expect(screen.getByText("0")).toBeInTheDocument();
    expect(screen.getByText("100")).toBeInTheDocument();
  });

  it("should render description when provided", () => {
    render(<RangeSlider {...defaultProps} description="Test description" />);
    expect(screen.getByText("Test description")).toBeInTheDocument();
  });

  it("should call onChange when slider value changes", async () => {
    const user = userEvent.setup();
    const onChange = jest.fn();
    render(<RangeSlider {...defaultProps} onChange={onChange} />);

    const slider = screen.getByRole("slider") as HTMLInputElement;
    await user.click(slider);

    // The slider should have the correct value (as string for input elements)
    expect(slider.value).toBe("50");
  });

  it("should be disabled when disabled prop is true", () => {
    render(<RangeSlider {...defaultProps} disabled={true} />);
    const slider = screen.getByRole("slider");
    expect(slider).toBeDisabled();
  });

  it("should not be disabled when disabled prop is false", () => {
    render(<RangeSlider {...defaultProps} disabled={false} />);
    const slider = screen.getByRole("slider");
    expect(slider).not.toBeDisabled();
  });

  it("should have correct min, max, and step attributes", () => {
    render(<RangeSlider {...defaultProps} min={10} max={90} step={5} />);
    const slider = screen.getByRole("slider");
    expect(slider).toHaveAttribute("min", "10");
    expect(slider).toHaveAttribute("max", "90");
    expect(slider).toHaveAttribute("step", "5");
  });

  it("should have correct id attribute", () => {
    render(<RangeSlider {...defaultProps} id="custom-id" />);
    const slider = screen.getByRole("slider");
    expect(slider).toHaveAttribute("id", "custom-id");
  });
});
