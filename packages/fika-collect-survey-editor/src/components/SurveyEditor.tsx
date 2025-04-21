import { useState, useEffect, FC, Fragment } from "react";
//import './SurveyEditor.css';
import { S3_BASE_URL } from "../constants";
import { SurveySchema, QuestionType } from "../SurveySchema";
import type { Survey, SurveyQuestion } from "../SurveySchema";
import { useParams, useBlocker } from "react-router";
import AppContainer from "./AppContainer";
import { useNavigate } from "react-router";

import FormField from "./FormField";
import SelectInput from "./SelectInput";
import TextInput from "./TextInput";
import OptionListInput from "./OptionListInput";

interface SurveyEditorProps {}

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
  index: number;
}> = ({ question, index, updateQuestion, deleteQuestion }) => {
  return (
    <div className="questionEditor card mb-5 mt-5" tabIndex={index}>
      <div className="card-header">
        <span className="card-title">Question {index + 1}</span>
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
              checked={false}
              onChange={(e) => updateQuestion({ ...question })}
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
            i18n
            required
            value={question.question}
            onChange={(text) => updateQuestion({ ...question, question: text })}
            multiline
          />
        </FormField>
        <FormField label="Hint">
          <TextInput
            i18n
            placeholder="Optional hint for the question"
            value={question.hint || ""}
            onChange={(hint) => updateQuestion({ ...question, hint })}
            multiline
          />
        </FormField>

        {["multiselect", "multiple_choice"].includes(question.type) && (
          <FormField label="Options">
            <OptionListInput
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

const SurveyEditor: FC<SurveyEditorProps> = () => {
  const [loading, setLoading] = useState(false);
  const [surveySchema, setSurveySchema] = useState<Survey | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

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

  return (
    <AppContainer>
      <form className="surveyEditor mt-5 mb-5">
        {errorMessage && <div className="error">{errorMessage}</div>}
        {loading && <div className="loading">Loading...</div>}
        {surveySchema && (
          <div className="surveySchema">
            <h1 className="mb-5">
              Edit Survey: <code>{surveySchema.id}</code>
            </h1>
            <div className="card mb-5 mt-5">
              <div className="card-header">
                <span className="card-title">Survey settings</span>
              </div>
              <div className="card-body pb-0">
                <div className="row mb-3">
                  <label className="col-form-label col-sm-3">Actions</label>
                  <div className="col-sm-9">
                    <button
                      type="button"
                      className="btn btn-primary me-2"
                      onClick={() => {
                        alert("Save button clicked!");
                      }}
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      className="btn btn-secondary me-2"
                      onClick={() => {
                        alert("Validate button clicked!");
                      }}
                    >
                      Validate
                    </button>
                    <button
                      type="button"
                      className="btn btn-danger"
                      onClick={() => {
                        navigate("/");
                      }}
                    >
                      Discard changes
                    </button>
                  </div>
                </div>
                <LanguageSelector
                  selectedLanguages={["en", "es"]}
                  onChange={() => {}}
                />
              </div>
            </div>
            <div className="card mb-5 mt-5">
              <div className="card-header">
                <span className="card-title">Survey details</span>
              </div>
              <div className="card-body pb-0">
                <FormField label="Title">
                  <TextInput
                    i18n
                    value={surveySchema.title}
                    onChange={(title) =>
                      setSurveySchema({ ...surveySchema, title })
                    }
                  />
                </FormField>
                <FormField label="description">
                  <TextInput
                    i18n
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
    </AppContainer>
  );
};

export default SurveyEditor;
