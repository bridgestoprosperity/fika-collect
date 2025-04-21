import { FC } from "react";

const Field: FC<{
  children: React.ReactNode;
  className?: string;
  label: string;
}> = ({ children, label, className = "" }) => {
  return (
    <div className={`field row mb-3 ${className}`}>
      <div className="col-sm-2">
        <label className="col-form-label">{label}</label>
      </div>
      <div className="col-sm-10">{children}</div>
    </div>
  );
};

export default Field;
