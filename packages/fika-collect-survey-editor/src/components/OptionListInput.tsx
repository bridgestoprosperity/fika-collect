import { FC, Fragment } from "react";

const OptionListInput: FC<{
  options: string[];
  onChange: (updatedOptions: string[]) => void;
  className?: string;
}> = ({ options, onChange, className }) => {
  const addOption = () => {
    onChange([...options, ""]);
  };

  const updateOption = (index: number, value: string) => {
    const updatedOptions = [...options];
    updatedOptions[index] = value;
    onChange(updatedOptions);
  };

  const deleteOption = (index: number) => {
    const updatedOptions = options.filter((_, i) => i !== index);
    onChange(updatedOptions);
  };

  return (
    <Fragment>
      {options.map((option, index) => (
        <div key={index} className="option-item mb-2">
          <div className="input-group">
            <button
              type="button"
              title="Provide a translation for this option"
              className="btn btn-outline-secondary"
              onClick={() => {
                updateOption(index, option);
              }}
            >
              🌐
            </button>
            <input
              type="text"
              required
              className={`form-control ${
                option.length === 0 ? "is-invalid" : ""
              }`}
              value={option}
              onChange={(e) => updateOption(index, e.target.value)}
              placeholder={`Option ${index + 1}`}
            />
            <button
              type="button"
              style={{ fontSize: "0.5em" }}
              className="btn btn-outline-danger"
              title="Delete option"
              onClick={() => {
                if (
                  !window.confirm(
                    "Are you sure you want to delete this option?"
                  )
                )
                  return;
                deleteOption(index);
              }}
            >
              ❌
            </button>
          </div>
        </div>
      ))}
      <button
        type="button"
        className="btn btn-sm btn-outline-primary"
        onClick={addOption}
      >
        + Add option
      </button>
    </Fragment>
  );
};

export default OptionListInput;
