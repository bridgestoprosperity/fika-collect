import React from 'react';
import {useState, useEffect} from 'react';
import './SurveyEditor.css';
import {S3_BASE_URL} from '../constants';
import {SurveySchema} from '../SurveySchema';
import type {Survey, SurveyQuestion} from '../SurveySchema';
import {useBlocker} from '../hooks/navigation';

interface SurveyEditorProps {
  surveyId: string;
}

async function fetchSurveySchema(surveyId: string): Promise<Survey> {
  return fetch(`${S3_BASE_URL}/surveys/${surveyId}.json`)
    .then(response => response.json())
    .then(data => SurveySchema.parse(data));
}

const SurveyQuestionEditor: React.FC<{
  question: SurveyQuestion;
  index: number;
}> = ({question, index}) => {
  return (
    <div className="question">
      <div className="question-header">Question {index + 1}</div>
      <div className="question-body">
        <h4>{question.question}</h4>
        <p>{question.hint}</p>
      </div>
    </div>
  );
};

const FormField: React.FC<{
  label: string;
  value: string;
  onChange: (value: string) => void;
}> = ({label, value, onChange}) => {
  return (
    <div className="form-field">
      <label>{label}</label>
    </div>
  );
};

const SurveyEditor: React.FC<SurveyEditorProps> = ({surveyId}) => {
  const [loading, setLoading] = useState(false);
  const [surveySchema, setSurveySchema] = useState<Survey | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useBlocker();

  useEffect(() => {
    setLoading(true);
    fetchSurveySchema(surveyId)
      .then(schema => setSurveySchema(schema))
      .catch(error => setErrorMessage('Failed to fetch survey'))
      .finally(() => setLoading(false));
  }, [surveyId]);

  return (
    <div className="surveyEditor">
      {errorMessage && <div className="error">{errorMessage}</div>}
      {loading && <div className="loading">Loading...</div>}
      {surveySchema && (
        <div className="surveySchema">
          <h1>
            Edit Survey: <kbd>{surveySchema.id}</kbd>
          </h1>
          <FormField
            label="Title"
            value={surveySchema.title}
            onChange={title => setSurveySchema({...surveySchema, title})}
          />
          <p>{surveySchema.description}</p>
          {surveySchema.questions.map(
            (question: SurveyQuestion, index: number) => (
              <SurveyQuestionEditor
                key={question.id}
                question={question}
                index={index}
              />
            ),
          )}
        </div>
      )}
    </div>
  );
};

export default SurveyEditor;
