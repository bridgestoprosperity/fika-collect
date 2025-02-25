import quickReport from '../surveys/quick_report.json';
import {SurveySchema} from './SurveySchema';

export class SurveySchemaManager {
  schemas: Map<string, SurveySchema> = new Map();

  async fetchSurveys() {
    this.schemas.set(quickReport.id, new SurveySchema(quickReport));
  }

  getSchema(id: string): SurveySchema {
    const survey = this.schemas.get(id);
    if (!survey) {
      throw new Error(`Survey with id ${id} not found`);
    }
    return survey;
  }
}
