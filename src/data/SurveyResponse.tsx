import {SurveySchema, SurveyQuestionSchema} from './SurveySchema';

export class SurveyQuestionResponse {
  question: SurveyQuestionSchema;
  _value: string = '';

  constructor(question: SurveyQuestionSchema) {
    this.question = question;

    switch (this.question.type) {
      case 'multiple_choice':
        this._value = this.question.options[0];
        break;
      case 'boolean':
        this._value = 'false';
        break;
    }
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
}

export class SurveyResponse {
  schema: SurveySchema;
  responses: SurveyQuestionResponse[] = [];

  constructor(schema: SurveySchema) {
    this.schema = schema;

    this.responses = schema.questions.map(
      question => new SurveyQuestionResponse(question),
    );
  }
}
