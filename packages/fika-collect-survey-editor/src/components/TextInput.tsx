import { FC } from "react";

const TextInput: FC<{
  value: string;
  multiline?: boolean;
  placeholder?: string;
  monospace?: boolean;
  className?: string;
  required?: boolean;
  i18n?: boolean;
  onChange: (value: string) => void;
}> = ({
  value,
  onChange,
  multiline = false,
  monospace = false,
  required = false,
  placeholder = "Enter text",
  i18n = false,
}) => {
  const style = { fontFamily: monospace ? "monospace" : undefined };
  const invalid = required && value.length === 0;
  return (
    <div className="input-group">
      {i18n && (
        <button
          type="button"
          className="btn btn-outline-secondary"
          onClick={() => {
            alert("Translate button clicked!");
          }}
        >
          🌐
        </button>
      )}
      {multiline ? (
        <textarea
          style={style}
          placeholder={placeholder}
          className={`form-control ${invalid ? "is-invalid" : ""}`}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={2}
        />
      ) : (
        <input
          style={style}
          type="text"
          placeholder={placeholder}
          className={`form-control ${invalid ? "is-invalid" : ""}`}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required={required}
        />
      )}
    </div>
  );
};

export default TextInput;
