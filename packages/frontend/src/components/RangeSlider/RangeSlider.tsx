import "./RangeSlider.css";

type RangeSliderProps = {
  id: string;
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (value: number) => void;
  disabled?: boolean;
  valueDisplay?: string;
  minLabel?: string;
  maxLabel?: string;
  description?: string;
};

export const RangeSlider = ({
  id,
  label,
  value,
  min,
  max,
  step = 1,
  onChange,
  disabled = false,
  valueDisplay,
  minLabel,
  maxLabel,
  description,
}: RangeSliderProps) => {
  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label htmlFor={id} className="block text-sm font-medium text-gray-700">
          {label}
        </label>
        {valueDisplay && (
          <span className="text-sm font-semibold text-blue-600">
            {valueDisplay}
          </span>
        )}
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer range-slider"
        style={{
          background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${percentage}%, #e5e7eb ${percentage}%, #e5e7eb 100%)`,
        }}
        disabled={disabled}
      />
      <div className="flex justify-between text-xs text-gray-500 mt-1">
        <span>{minLabel ?? min}</span>
        <span>{maxLabel ?? max}</span>
      </div>
      {description && (
        <p className="text-xs text-gray-500 mt-1">{description}</p>
      )}
    </div>
  );
};
