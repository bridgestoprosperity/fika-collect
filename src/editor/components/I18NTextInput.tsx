import { FC, Fragment } from "react";
import type { I18NText } from "fika-collect-survey-schema";
import { useLocale } from "../hooks/useLocale";
import { LOCALE_LABELS } from "fika-collect-survey-schema";

const I18NTextInput: FC<{
  value: I18NText;
  multiline?: boolean;
  placeholder?: string;
  monospace?: boolean;
  className?: string;
  required?: boolean;
  onChange: (value: I18NText) => void;
}> = ({
  value,
  onChange,
  multiline = false,
  monospace = false,
  required = false,
  placeholder = "Enter text",
}) => {
  const style = { fontFamily: monospace ? "monospace" : undefined };

  const { selectedLocale } = useLocale();
  const typedSelectedLocale = selectedLocale as keyof typeof LOCALE_LABELS;
  const translationPrompt = `${
    LOCALE_LABELS[typedSelectedLocale] || "Enter"
  } translation`;

  return (
    <div className="input-group">
      {multiline ? (
        <Fragment>
          <textarea
            style={style}
            value={value.en || ""}
            placeholder={placeholder}
            className={`form-control`}
            onChange={(e) => onChange({ ...value, en: e.target.value })}
            rows={2}
          />
          {selectedLocale !== "en" && (
            <textarea
              style={style}
              value={value[selectedLocale] || ""}
              placeholder={translationPrompt}
              className={`form-control`}
              onChange={(e) =>
                onChange({ ...value, [selectedLocale]: e.target.value })
              }
              rows={2}
            />
          )}
        </Fragment>
      ) : (
        <Fragment>
          <input
            style={style}
            type="text"
            value={value.en || ""}
            placeholder={placeholder}
            className={`form-control`}
            onChange={(e) => onChange({ ...value, en: e.target.value })}
            required={required}
          />
          {selectedLocale !== "en" && (
            <input
              style={style}
              type="text"
              value={value[selectedLocale] || ""}
              placeholder={translationPrompt}
              className={`form-control`}
              onChange={(e) =>
                onChange({ ...value, [selectedLocale]: e.target.value })
              }
              required={required}
            />
          )}
        </Fragment>
      )}
    </div>
  );
};

export default I18NTextInput;
