import { FC, JSX } from "react";
import { NavLink } from "react-router";
import { useLocale } from "../hooks/useLocale";

const Header: FC<{
  breadcrumbs?: Array<string | JSX.Element>;
}> = ({ breadcrumbs = [] }) => {
  const { selectedLocale, setLocale } = useLocale();

  return (
    <nav className="header navbar navbar-expand-lg sticky-top">
      <div className="container-fluid">
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb">
            <li key="brand" className="breadcrumb-item">
              <NavLink className="navbar-brand" to="/">
                Fika Collect Survey Editor
              </NavLink>
            </li>
            {breadcrumbs.map((crumb, index) => (
              <li
                key={index}
                className={`breadcrumb-item ${
                  index === breadcrumbs.length - 1 ? "active" : ""
                }`}
              >
                {crumb}
              </li>
            ))}
          </ol>
        </nav>

        {selectedLocale && (
          <div>
            <select
              title="Locale"
              className="form-select"
              value={selectedLocale}
              onChange={(e) => setLocale && setLocale(e.target.value)}
            >
              <option value="en">English</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
              <option value="de">German</option>
            </select>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Header;
/*
<button
  className="navbar-toggler"
  type="button"
  data-bs-toggle="collapse"
  data-bs-target="#navbarNav"
  aria-controls="navbarNav"
  aria-expanded="false"
  aria-label="Toggle navigation">
  <span className="navbar-toggler-icon"></span>
</button>
<div className="collapse navbar-collapse" id="navbarNav">
  <ul className="navbar-nav">
  </ul>
</div>
*/
