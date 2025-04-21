import { FC } from "react";

const SelectInput: FC<{
  options: Record<string, string>;
  value: string;
  className?: string;
  onChange: (value: string) => void;
}> = ({ options, value, onChange, className = "" }) => {
  return (
    <select
      title="Select field"
      className="form-select"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      {Object.entries(options).map(([optionValue, optionLabel]) => (
        <option key={optionValue} value={optionValue}>
          {optionLabel}
        </option>
      ))}
    </select>
  );
};

export default SelectInput;
