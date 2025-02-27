export type SurveySchemaQuestionType =
  | 'multiple_choice'
  | 'short_answer'
  | 'long_answer'
  | 'location'
  | 'boolean'
  | 'photos';

export class SurveyQuestionSchema {
  id: string;
  type: SurveySchemaQuestionType;
  question: string;
  hint?: string;
  options: string[] = [];

  constructor(questionJSON: any) {
    this.id = questionJSON.id;
    this.type = questionJSON.type;
    this.question = questionJSON.question;
    this.hint = questionJSON.hint;
    if (Array.isArray(questionJSON.options)) {
      this.options = questionJSON.options.map((option: any) => {
        if (typeof option !== 'string') {
          throw new Error('Option must be a string');
        }
        return option;
      });
    }
  }
}

export class SurveySchema {
  id: string;
  title: string;
  description: string;
  questions: SurveyQuestionSchema[] = [];

  constructor(schemaJSON: any) {
    this.id = schemaJSON.id;
    this.title = schemaJSON.title;
    this.description = schemaJSON.description;

    this.questions = schemaJSON.questions.map(
      (questionJSON: any) => new SurveyQuestionSchema(questionJSON),
    );
  }
}
