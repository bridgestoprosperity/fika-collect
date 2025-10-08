import { useState, useEffect } from "react";
//import styles from "./SurveyList.module.css";
import { NavLink } from "react-router";
import Header from "./Header";

import { API_BASE_URL } from "../constants";

async function fetchSurveys() {
  return fetch(`${API_BASE_URL}/editor/surveys`)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then(({ surveys }) => surveys);
}

const SurveyList: React.FC<{}> = () => {
  const [loading, setLoading] = useState(false);
  const [surveys, setSurveys] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);

  function load() {
    setLoading(true);
    setError(null);
    return (
      fetchSurveys()
        .then(setSurveys)
        // Slow it down so it feels like it did something
        .then(() => new Promise((resolve) => setTimeout(resolve, 200)))
        .then(() => {
          setLoading(false);
        })
        .catch((err) => {
          console.error("Failed to fetch surveys:", err);
          setError("Failed to load surveys. Check console for details.");
          setLoading(false);
        })
    );
  }

  async function deleteSurvey(surveyId: string) {
    if (
      !window.confirm(
        `Are you sure you want to delete survey "${surveyId}"? This action cannot be undone.`
      )
    ) {
      return;
    }

    setDeleting(surveyId);
    try {
      const response = await fetch(
        `${API_BASE_URL}/editor/surveys/${surveyId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.error || `HTTP error! status: ${response.status}`
        );
      }

      // Remove the deleted survey from the list
      setSurveys(surveys.filter((s) => s.survey_id !== surveyId));
      alert(`Survey "${surveyId}" deleted successfully!`);
    } catch (error) {
      console.error("Failed to delete survey:", error);
      alert(
        `Failed to delete survey: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    } finally {
      setDeleting(null);
    }
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

          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}

          <table className="table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Survey ID</th>
                <th>Status</th>
                <th>Updated</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {surveys.length === 0 && !loading && !error && (
                <tr>
                  <td colSpan={5} className="text-center text-muted">
                    No surveys found. Click "+ New survey" to create one.
                  </td>
                </tr>
              )}
              {surveys.map(
                ({ survey_id, title, url, updated_at, published }) => (
                  <tr key={survey_id}>
                    <td>
                      <NavLink to={`/surveys/${survey_id}/edit`}>
                        {title || survey_id}
                      </NavLink>
                    </td>
                    <td>
                      <code>{survey_id}</code>
                    </td>
                    <td>
                      {published ? (
                        <span className="badge bg-success">Published</span>
                      ) : (
                        <span className="badge bg-secondary">Unpublished</span>
                      )}
                    </td>
                    <td>
                      {updated_at
                        ? new Date(updated_at).toLocaleString()
                        : "Unknown"}
                    </td>
                    <td>
                      <NavLink
                        className="btn btn-primary btn-sm me-2"
                        to={`/surveys/${survey_id}/edit`}
                      >
                        Edit
                      </NavLink>
                      <button
                        className="btn btn-danger btn-sm"
                        disabled={deleting === survey_id}
                        onClick={() => deleteSurvey(survey_id)}
                      >
                        {deleting === survey_id ? "Deleting..." : "Delete"}
                      </button>
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SurveyList;
