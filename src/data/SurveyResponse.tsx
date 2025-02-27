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
          id: this.question.id,
          value: this._value === 'yes',
        };
      default:
        return {
          id: this.question.id,
          value: this._value,
        };
    }
  }
}

export class SurveyResponse {
  id: string;
  schema: SurveySchema;
  responses: SurveyQuestionResponse[] = [];

  constructor(schema: SurveySchema) {
    this.schema = schema;

    this.id = uuidv4();

    this.responses = schema.questions.map(
      question => new SurveyQuestionResponse(question),
    );
  }

  serialize() {
    return {
      id: this.id,
      responses: this.responses.map(response => response.serialize()),
      submitted_at: new Date().toISOString(),
    };
  }
}
