import { FC, Fragment } from "react";
import type { I18NText } from "fika-collect-survey-schema";
import { useLocale } from "../hooks/useLocale";
import { LOCALE_LABELS } from "fika-collect-survey-schema";

const OptionListInput: FC<{
  options: I18NText[];
  onChange: (updatedOptions: I18NText[]) => void;
}> = ({ options, onChange }) => {
  const { selectedLocale } = useLocale();
  const typedSelectedLocale = selectedLocale as keyof typeof LOCALE_LABELS;
  const translationPrompt = `${
    LOCALE_LABELS[typedSelectedLocale] || "Enter"
  } translation`;

  const addOption = () => {
    onChange([...options, { en: "" }]);
  };

  const updateOption = (index: number, value: I18NText) => {
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
            <input
              type="text"
              required
              value={option.en || ""}
              className={`form-control`}
              onChange={(e) =>
                updateOption(index, { ...option, en: e.target.value })
              }
              placeholder={`Option ${index + 1}`}
            />
            {selectedLocale !== "en" && (
              <input
                type="text"
                required
                value={option[selectedLocale] || ""}
                className={`form-control`}
                onChange={(e) =>
                  updateOption(index, {
                    ...option,
                    [selectedLocale]: e.target.value,
                  })
                }
                placeholder={translationPrompt}
              />
            )}
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
