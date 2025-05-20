import { FC, Fragment } from "react";

const TextInput: FC<{
  value: string;
  multiline?: boolean;
  placeholder?: string;
  monospace?: boolean;
  className?: string;
  required?: boolean;
  onChange: (value: string) => void;
}> = ({
  value,
  onChange,
  multiline = false,
  monospace = false,
  required = false,
  placeholder = "Enter text",
}) => {
  const style = { fontFamily: monospace ? "monospace" : undefined };
  const invalid = false;
  return (
    <div className="input-group">
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
