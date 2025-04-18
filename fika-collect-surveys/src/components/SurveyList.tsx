import React from 'react';
import {useState, useEffect} from 'react';
import './SurveyList.css';
import Link from './Link';

import {S3_BASE_URL, MANIFEST_PATH} from '../constants';

const sampleSurveys = {
  surveys: [
    {
      survey_id: 'quick_report',
      key: 'surveys/quick_report.json',
      updated_at: '2025-03-12T20:34:32.253Z',
    },
    {
      survey_id: 'detailed_report',
      key: 'surveys/detailed_report.json',
      updated_at: '2025-03-12T20:38:01.301Z',
    },
  ],
};

async function fetchSurveys() {
  return fetch(`${S3_BASE_URL}/${MANIFEST_PATH}`)
    .then(response => response.json())
    .then(({surveys}) => surveys);
}

interface SurveyListProps {
  setCurrentSurveyId: React.Dispatch<React.SetStateAction<string | null>>;
}

const SurveyList: React.FC<SurveyListProps> = ({setCurrentSurveyId}) => {
  const [loading, setLoading] = useState(false);
  const [surveys, setSurveys] = useState(sampleSurveys.surveys);

  function load() {
    setLoading(true);
    return fetchSurveys()
      .then(setSurveys)
      .then(() => new Promise(resolve => setTimeout(resolve, 200)))
      .then(() => {
        setLoading(false);
      });
  }

  useEffect(() => {
    //load();
  }, []);

  return (
    <div className="surveyList">
      <div className="surveyList-actions">
        <button
          type="button"
          className="btn"
          onClick={e => {
            e.preventDefault();
          }}>
          + New Survey
        </button>

        <button
          type="button"
          disabled={loading}
          className="btn"
          onClick={e => {
            load();
            e.preventDefault();
          }}>
          {loading ? 'Loading...' : 'Refresh'}
        </button>
      </div>

      <table className="surveyList-table">
        <thead>
          <tr>
            <th>Survey Identifier</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {surveys.map(({survey_id, key, updated_at}) => (
            <tr key={key}>
              <td>{survey_id}</td>
              <td>
                <Link
                  to={`/surveys/${survey_id}/edit`}
                  className="surveyList-action"
                  onClick={e => {
                    //e.preventDefault();
                    //setCurrentSurveyId(survey_id);
                  }}>
                  Edit
                </Link>
                <button className="surveyList-action" disabled>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SurveyList;
