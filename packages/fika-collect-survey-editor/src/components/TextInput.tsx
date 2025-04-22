import { FC, Fragment } from "react";

const TextInput: FC<{
  value: string;
  multiline?: boolean;
  placeholder?: string;
  monospace?: boolean;
  className?: string;
  required?: boolean;
  onChange: (value: string) => void;
  locale?: string;
}> = ({
  value,
  onChange,
  multiline = false,
  monospace = false,
  required = false,
  placeholder = "Enter text",
  locale = "en",
}) => {
  const style = { fontFamily: monospace ? "monospace" : undefined };
  const invalid = required && value.length === 0;
  return (
    <div className="input-group">
      {multiline ? (
        <Fragment>
          <textarea
            style={style}
            placeholder={placeholder}
            className={`form-control ${invalid ? "is-invalid" : ""}`}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            rows={2}
          />
          {locale !== "en" && (
            <textarea
              style={style}
              placeholder={"Enter translation"}
              className={`form-control ${invalid ? "is-invalid" : ""}`}
              onChange={(e) => onChange(e.target.value)}
              rows={2}
            />
          )}
        </Fragment>
      ) : (
        <Fragment>
          <input
            style={style}
            type="text"
            placeholder={placeholder}
            className={`form-control ${invalid ? "is-invalid" : ""}`}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            required={required}
          />
          {locale !== "en" && (
            <input
              style={style}
              type="text"
              placeholder={"Enter translation"}
              className={`form-control ${invalid ? "is-invalid" : ""}`}
              onChange={(e) => onChange(e.target.value)}
              required={required}
            />
          )}
        </Fragment>
      )}
    </div>
  );
};

export default TextInput;
