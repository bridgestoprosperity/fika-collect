import {SurveySchema} from './SurveySchema';
import {MMKVLoader} from 'react-native-mmkv-storage';

const surveySchemaStorage = new MMKVLoader()
  .withInstanceID('surveys')
  .initialize();

const S3_BASE_URL = 'https://fika-collect.s3.us-west-1.amazonaws.com';
const MANIFEST_URL = `${S3_BASE_URL}/surveys/manifest.json`;

export class SurveySchemaManager {
  schemas: Map<string, SurveySchema> = new Map();

  constructor() {
    try {
      const storedSchemas = surveySchemaStorage.getMap('schemas') as any;
      if (storedSchemas) {
        for (const [id, schema] of storedSchemas) {
          console.log({id, schema});
          this.schemas.set(id, new SurveySchema(schema));
        }
      }
    } catch (error) {
      console.error('Failed to load schemas from storage', error);
    }
  }

  async fetchSurveys() {
    const manifestRespones = await fetch(MANIFEST_URL);
    if (!manifestRespones.ok) {
      console.warn('Failed to fetch survey manifest');
    }
    const manifest = await manifestRespones.json();

    // Clear existing schemas if manifest successfully fetched
    this.schemas = new Map();

    for (const survey of manifest.surveys) {
      try {
        const url = `${S3_BASE_URL}/${survey.key}`;
        console.log(`Fetching survey from ${url}`);
        const response = await fetch(url);
        const surveyJSON = await response.json();
        this.schemas.set(surveyJSON.id, new SurveySchema(surveyJSON));
      } catch (e) {
        console.error(e);
      }
    }

    // Persist fetched schemas to local storage
    await surveySchemaStorage.setMapAsync(
      'schemas',
      Array.from(this.schemas.entries()),
    );
  }

  getSchema(id: string): SurveySchema {
    const survey = this.schemas.get(id);
    if (!survey) {
      throw new Error(`Survey with id ${id} not found`);
    }
    return survey;
  }

  fetchSchemas() {}
}
