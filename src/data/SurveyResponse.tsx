import {SurveySchema, SurveyQuestionSchema} from './SurveySchema';
import 'react-native-get-random-values';
import {v4 as uuidv4} from 'uuid';

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

  serialize() {
    return {
      question: this.question.question,
      value: this._value,
    };
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
    };
  }
}
