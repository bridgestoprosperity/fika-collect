import {SurveySchema, SurveyQuestionSchema} from './SurveySchema';
import 'react-native-get-random-values';
import {v4 as uuidv4} from 'uuid';

import {type SurveySchemaQuestionType} from './SurveySchema';

export class SurveyQuestionResponse {
  question: SurveyQuestionSchema;
  type: SurveySchemaQuestionType;
  _value: string = '';

  constructor(question: SurveyQuestionSchema) {
    this.question = question;
    this.type = this.question.type;

    switch (this.type) {
      case 'multiple_choice':
        this._value = this.question.options[0];
        break;
      case 'boolean':
        this._value = 'no';
        break;
    }
    this._value = this._value || 'REMOVE ME';
  }

  get hasResponse() {
    return this._value !== '';
  }

  set value(value: string) {
    this._value = value;
  }

  get value() {
    return this._value;
  }

  serialize() {
    switch (this.type) {
      case 'boolean':
        return {
          question_id: this.question.id,
          value: this._value === 'yes',
        };
      default:
        return {
          question_id: this.question.id,
          value: this._value,
        };
    }
  }
}

export class SurveyResponse {
  id: string;
  schema: SurveySchema;
  responses: SurveyQuestionResponse[] = [];
  uploaded: boolean = false;
  submittedAt: Date | null;

  constructor(schema: SurveySchema) {
    this.schema = schema;
    this.id = uuidv4();
    this.submittedAt = null;
    this.responses = schema.questions.map(
      question => new SurveyQuestionResponse(question),
    );
  }

  static fromJSON(json: any) {
    const response = new SurveyResponse(json.schema);
    response.id = json.id;
    response.submittedAt = json.submitted_at
      ? new Date(json.submitted_at)
      : null;
    const responses = json.responses.map((responseJSON: any) => {
      console.log({responseJSON});
      const question = response.schema.questions.find(
        (q: SurveyQuestionSchema) => q.id === responseJSON.question_id,
      );
      if (!question) {
        throw new Error(
          `Question with id ${responseJSON.question_id} not found`,
        );
      }
      const questionResponse = new SurveyQuestionResponse(question);
      questionResponse.value = responseJSON.value;
      return questionResponse;
    });
    response.responses = responses;
    return response;
  }

  serialize() {
    return {
      id: this.id,
      survey_id: this.schema.id,
      responses: this.responses.map(response => response.serialize()),
      submitted_at: this.submittedAt ? this.submittedAt.toISOString() : null,
      schema: this.schema.serialize(),
    };
  }
}
