import { useState, useEffect, FC, Fragment } from "react";
//import './SurveyEditor.css';
import { S3_BASE_URL } from "../constants";
import { SurveySchema, QuestionType } from "fika-collect-survey-schema";
import type { Survey, SurveyQuestion } from "fika-collect-survey-schema";
import { useParams, useBlocker } from "react-router";
import AppContainer from "./AppContainer";
import { useNavigate, NavLink } from "react-router";

import Header from "./Header";
import FormField from "./FormField";
import SelectInput from "./SelectInput";
import TextInput from "./TextInput";
import OptionListInput from "./OptionListInput";

const questionTypeLabels = {
  short_answer: "Short answer",
  long_answer: "Long answer",
  multiple_choice: "Single select",
  multiselect: "Multiple select",
  boolean: "Yes/no",
  photo: "Photo",
  location: "Location",
};

async function fetchSurveySchema(
  surveyId: string | undefined
): Promise<Survey> {
  if (!surveyId) return Promise.reject("Survey ID is required");
  return fetch(`${S3_BASE_URL}/surveys/${surveyId}.json`)
    .then((response) => response.json())
    .then((data) => SurveySchema.parse(data));
}

const SurveyQuestionEditor: FC<{
  question: SurveyQuestion;
  updateQuestion: (question: SurveyQuestion) => void;
  deleteQuestion: () => void;
  locale: string;
  index: number;
}> = ({ question, index, updateQuestion, deleteQuestion, locale }) => {
  return (
    <div
      className="questionEditor card mb-5 mt-5"
      tabIndex={index}
      id={`question-${index + 1}`}
    >
      <div className="card-header">
        <span className="card-title">
          <a href={`#question-${index + 1}`}>Question {index + 1}</a>
        </span>
        <span className="header-buttons float-end">
          <button
            type="button"
            className="btn btn-outline-danger btn-sm"
            onClick={() => {
              if (
                !window.confirm(
                  "Are you sure you want to delete this question?"
                )
              ) {
                return;
              }
              deleteQuestion();
            }}
          >
            Delete question
          </button>
        </span>
      </div>
      <div className="card-body pb-0">
        <FormField label="ID">
          <TextInput
            placeholder="question_id (no whitespace)"
            monospace
            required
            value={question.id}
            onChange={(id) => {
              updateQuestion({ ...question, id });
            }}
          />
        </FormField>
        <FormField label="Required">
          <div className="form-check form-switch">
            <input
              className="form-check-input"
              type="checkbox"
              id={`required-${index}`}
              checked={question.required}
              onChange={(e) =>
                updateQuestion({
                  ...question,
                  required: (e.target as HTMLInputElement).checked,
                })
              }
            />
          </div>
        </FormField>
        <FormField label="Type">
          <SelectInput
            options={questionTypeLabels}
            value={question.type}
            onChange={(type) =>
              updateQuestion({ ...question, type: type as QuestionType })
            }
          />
        </FormField>
        <FormField label="Prompt">
          <TextInput
            locale={locale}
            value={question.question}
            onChange={(text) => updateQuestion({ ...question, question: text })}
            multiline
          />
        </FormField>
        <FormField label="Hint">
          <TextInput
            locale={locale}
            placeholder="Optional hint for the question"
            value={question.hint || ""}
            onChange={(hint) => updateQuestion({ ...question, hint })}
            multiline
          />
        </FormField>

        {["multiselect", "multiple_choice"].includes(question.type) && (
          <FormField label="Options">
            <OptionListInput
              locale={locale}
              options={question.options || []}
              onChange={(options) => {
                updateQuestion({ ...question, options: options });
              }}
            />
          </FormField>
        )}
      </div>
    </div>
  );
};

const InsertQuestionButton: FC<{
  setSurveySchema: (schema: Survey) => void;
  surveySchema: Survey;
  index: number;
}> = ({ index, surveySchema, setSurveySchema }) => {
  return (
    <button
      type="button"
      className="btn btn-sm btn-primary me-2"
      onClick={() => {
        const newQuestion: SurveyQuestion = {
          id: "",
          type: "short_answer",
          required: true,
          question: "",
          hint: "",
          options: [],
        };
        const updatedQuestions = [
          ...surveySchema.questions.slice(0, index + 1),
          newQuestion,
          ...surveySchema.questions.slice(index + 1),
        ];
        setSurveySchema({
          ...surveySchema,
          questions: updatedQuestions,
        });
      }}
    >
      + Insert question
    </button>
  );
};

const SwapQuestionsButton: FC<{
  setSurveySchema: (schema: Survey) => void;
  surveySchema: Survey;
  index: number;
}> = ({ index, surveySchema, setSurveySchema }) => {
  return (
    <button
      type="button"
      className="btn btn-sm btn-primary"
      onClick={() => {
        const updatedQuestions = [...surveySchema.questions];
        const temp = updatedQuestions[index];
        updatedQuestions[index] = updatedQuestions[index + 1];
        updatedQuestions[index + 1] = temp;
        setSurveySchema({
          ...surveySchema,
          questions: updatedQuestions,
        });
      }}
    >
      ⇅ Swap questions
    </button>
  );
};

const LANGUAGES = {
  en: "English",
  es: "Spanish",
  fr: "French",
  sw: "Swahili",
};

const LanguageSelector: FC<{
  selectedLanguages: string[];
  onChange: (language: string) => void;
}> = ({ selectedLanguages, onChange }) => {
  return (
    <div className="row mb-3">
      <label className="col-form-label col-sm-3">Languages</label>
      <div className="col-sm-9">
        <div className="form-check form-switch">
          {Object.entries(LANGUAGES).map(([langCode, langName]) => (
            <div key={langCode} className="form-check form-switch">
              <input
                className="form-check-input"
                type="checkbox"
                id={`lang-${langCode}`}
                checked={selectedLanguages.includes(langCode)}
                onChange={() => {
                  if (selectedLanguages.includes(langCode)) {
                    onChange(langCode);
                  } else {
                    onChange("");
                  }
                }}
              />
              <label className="form-check-label" htmlFor={`lang-${langCode}`}>
                {langName}
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

function downloadJSON(data: any, filename: string) {
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

const SurveyEditor: FC<{
  action?: "new" | null;
}> = ({ action = null }) => {
  const [loading, setLoading] = useState(false);
  const [surveySchema, setSurveySchema] = useState<Survey | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [locale, setLocale] = useState<string>("en");

  console.log(action);

  const { surveyId } = useParams<{ surveyId: string }>();
  const navigate = useNavigate();

  useBlocker(() => {
    if (!surveySchema) return false;
    return !window.confirm(
      "You have unsaved changes. Are you sure you want to leave this page?"
    );
  });

  useEffect(() => {
    setLoading(true);
    fetchSurveySchema(surveyId)
      .then((schema) => setSurveySchema(schema))
      .catch((error) => setErrorMessage("Failed to fetch survey"))
      .finally(() => setLoading(false));
  }, [surveyId]);

  const breadcrumbs = [];
  if (surveySchema) {
    breadcrumbs.push(
      <NavLink key="edit" to={`/surveys/${surveySchema.id}/edit`}>
        <code>{surveySchema.id}</code>
      </NavLink>
    );
  }

  return (
    <div className="app">
      <Header locale={locale} setLocale={setLocale} breadcrumbs={breadcrumbs} />
      <div className="container-sm" style={{ margin: "0 auto" }}>
        <form className="surveyEditor mt-5 mb-5">
          {errorMessage && <div className="error">{errorMessage}</div>}
          {loading && <div className="loading">Loading...</div>}
          {surveySchema && (
            <div className="surveySchema">
              <div className="card mb-5 mt-5">
                <div className="card-header">
                  <span className="card-title">Survey settings</span>
                </div>
                <div className="card-body pb-0">
                  <div className="row mb-3">
                    <label className="col-form-label col-sm-3">Publish</label>
                    <div className="col-sm-9">
                      <button
                        type="button"
                        className="btn btn-primary me-2"
                        onClick={() => {
                          alert("Save button clicked!");
                        }}
                      >
                        Save to S3
                      </button>
                    </div>
                  </div>
                  <div className="row mb-3">
                    <label className="col-form-label col-sm-3">Editor</label>
                    <div className="col-sm-9">
                      <button
                        type="button"
                        className="btn btn-secondary me-2"
                        onClick={() =>
                          downloadJSON(surveySchema, `${surveySchema.id}.json`)
                        }
                      >
                        Download JSON
                      </button>
                      <button
                        type="button"
                        className="btn btn-danger me-2"
                        onClick={() => {
                          navigate("/");
                        }}
                      >
                        Discard changes
                      </button>
                    </div>
                  </div>
                  {/*<LanguageSelector
                    selectedLanguages={["en", "es"]}
                    onChange={() => {}}
                  />*/}
                </div>
              </div>
              <div className="card mb-5 mt-5">
                <div className="card-header">
                  <span className="card-title">Survey details</span>
                </div>
                <div className="card-body pb-0">
                  <FormField label="Title">
                    <TextInput
                      locale={locale}
                      value={surveySchema.title}
                      onChange={(title) =>
                        setSurveySchema({ ...surveySchema, title })
                      }
                    />
                  </FormField>
                  <FormField label="description">
                    <TextInput
                      locale={locale}
                      value={surveySchema.description}
                      onChange={(description) =>
                        setSurveySchema({ ...surveySchema, description })
                      }
                    />
                  </FormField>
                </div>
              </div>
              <InsertQuestionButton
                setSurveySchema={setSurveySchema}
                index={-1}
                surveySchema={surveySchema}
              />
              {surveySchema.questions.map(
                (question: SurveyQuestion, index: number) => (
                  <Fragment key={index}>
                    <SurveyQuestionEditor
                      locale={locale}
                      updateQuestion={(updatedQuestion: SurveyQuestion) => {
                        const updatedQuestions = [...surveySchema.questions];
                        updatedQuestions[index] = updatedQuestion;
                        setSurveySchema({
                          ...surveySchema,
                          questions: updatedQuestions,
                        });
                      }}
                      deleteQuestion={() => {
                        const updatedQuestions = surveySchema.questions.filter(
                          (_, i) => i !== index
                        );
                        setSurveySchema({
                          ...surveySchema,
                          questions: updatedQuestions,
                        });
                      }}
                      question={question}
                      index={index}
                    />
                    <InsertQuestionButton
                      setSurveySchema={setSurveySchema}
                      index={index}
                      surveySchema={surveySchema}
                    />
                    {index < surveySchema.questions.length - 1 && (
                      <SwapQuestionsButton
                        setSurveySchema={setSurveySchema}
                        index={index}
                        surveySchema={surveySchema}
                      />
                    )}
                  </Fragment>
                )
              )}
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default SurveyEditor;
