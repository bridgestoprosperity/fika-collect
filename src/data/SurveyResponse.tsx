import {SurveySchema, SurveyQuestionSchema} from './SurveySchema';
import 'react-native-get-random-values';
import {nanoid} from 'nanoid';

import {type SurveySchemaQuestionType} from './SurveySchema';

export class SurveyQuestionResponse {
  question: SurveyQuestionSchema;
  type: SurveySchemaQuestionType;
  _value: string = '';

  // This is used for photo questions, where we want to replace the value with the photo path
  // when serializing the response without modifying the original value. Otherwise,
  // we would modify the original fileURI and break the photo question.
  replaceValueOnSerialization: boolean = false;
  _valueForSerialization: string = '';

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
      case 'short_answer':
      case 'long_answer':
        this._value = 'REMOVE ME';
        break;
    }
  }

  set valueForSerialization(value: string) {
    this.replaceValueOnSerialization = true;
    this._valueForSerialization = value;
  }

  get valueForSerialization() {
    if (this.replaceValueOnSerialization) {
      return this._valueForSerialization;
    } else {
      return this._value;
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
    switch (this.type) {
      case 'boolean':
        return {
          question_id: this.question.id,
          value: this.valueForSerialization === 'yes',
        };
      default:
        return {
          question_id: this.question.id,
          value: this.valueForSerialization,
        };
    }
  }
}

function createRandomId() {
  const date = new Date();
  const formattedDate = (
    date.toISOString().split('T')[0] +
    date.toTimeString().split(' ')[0].replace(/:/g, '').slice(0, 6)
  ).replace(/-/g, '');
  return `${formattedDate}-${nanoid(8)}`;
}

export class SurveyResponse {
  id: string;
  schema: SurveySchema;
  responses: SurveyQuestionResponse[] = [];
  uploaded: boolean = false;
  submittedAt: Date | null;

  constructor(schema: SurveySchema) {
    this.schema = schema;
    this.id = createRandomId();
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
