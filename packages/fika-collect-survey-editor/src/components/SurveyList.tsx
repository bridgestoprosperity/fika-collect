import { useState, useEffect } from "react";
//import styles from "./SurveyList.module.css";
import { NavLink } from "react-router";
import Header from "./Header";

import { S3_BASE_URL, MANIFEST_PATH } from "../constants";

const sampleSurveys = {
  surveys: [
    {
      survey_id: "quick_report",
      key: "surveys/quick_report.json",
      updated_at: "2025-03-12T20:34:32.253Z",
    },
    {
      survey_id: "detailed_report",
      key: "surveys/detailed_report.json",
      updated_at: "2025-03-12T20:38:01.301Z",
    },
  ],
};

async function fetchSurveys() {
  return fetch(`${S3_BASE_URL}/${MANIFEST_PATH}`)
    .then((response) => response.json())
    .then(({ surveys }) => surveys);
}

const SurveyList: React.FC<{}> = () => {
  const [loading, setLoading] = useState(false);
  const [surveys, setSurveys] = useState(sampleSurveys.surveys);

  function load() {
    setLoading(true);
    return (
      fetchSurveys()
        .then(setSurveys)
        // Slow it down so it feels like it did something
        .then(() => new Promise((resolve) => setTimeout(resolve, 200)))
        .then(() => {
          setLoading(false);
        })
    );
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="app">
      <Header />
      <div className="container-sm" style={{ margin: "0 auto" }}>
        <div className="surveyList mt-5">
          <div className="surveyList-actions text-end mb-3">
            <NavLink
              type="button"
              to={"/surveys/new"}
              className="btn btn-primary btn-sm me-2"
            >
              + New survey
            </NavLink>

            <button
              type="button"
              disabled={loading}
              className="btn btn-secondary btn-sm"
              onClick={(e) => {
                load();
                e.preventDefault();
              }}
            >
              {loading ? "⏳ Loading..." : "🔄 Refresh"}
            </button>
          </div>

          <table className="table">
            <thead>
              <tr>
                <th>Survey ID</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {surveys.map(({ survey_id, key, updated_at }) => (
                <tr key={key}>
                  <td>{survey_id}</td>
                  <td>
                    <NavLink
                      className="btn btn-primary btn-sm me-2"
                      to={`/surveys/${survey_id}/edit`}
                    >
                      Edit
                    </NavLink>
                    <button className="btn btn-danger btn-sm" disabled>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SurveyList;
