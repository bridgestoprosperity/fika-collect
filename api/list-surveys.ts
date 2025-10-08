import { Bucket } from './util/config.js';
import s3 from './util/s3.js';
import { ListObjectsV2Command, GetObjectCommand } from '@aws-sdk/client-s3';
import { SurveySchema } from 'fika-collect-survey-schema';

const Prefix = 'surveys/';

interface SurveyListItem {
  survey_id: string;
  key: string;
  updated_at: Date | undefined;
  published: boolean;
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const filter = url.searchParams.get('filter') || 'published';

  let statusCode = 200;
  let result: any;

  try {
    const listCommand = new ListObjectsV2Command({ Bucket, Prefix });
    const data = await s3.send(listCommand);

    const surveyFiles = (data.Contents || []).filter(obj => {
      const key = obj.Key || '';
      // Skip the directory itself and non-.json files, and skip manifest.json
      return key !== Prefix && key.endsWith('.json') && key !== `${Prefix}manifest.json`;
    });

    const surveys: SurveyListItem[] = [];

    // Read each survey to get its published status
    for (const file of surveyFiles) {
      const key = file.Key!;
      const surveyId = key.replace(Prefix, '').replace('.json', '');

      try {
        // Fetch the survey from S3
        const getCommand = new GetObjectCommand({ Bucket, Key: key });
        const surveyData = await s3.send(getCommand);
        const bodyString = await surveyData.Body?.transformToString();

        if (!bodyString) {
          console.warn(`Empty survey file: ${key}`);
          continue;
        }

        const survey = JSON.parse(bodyString);
        const validatedSurvey = SurveySchema.safeParse(survey);

        if (!validatedSurvey.success) {
          console.warn(`Invalid survey schema for ${key}:`, validatedSurvey.error);
          continue;
        }

        // Default to true if published field is not set (backward compatibility)
        const published = validatedSurvey.data.published ?? true;

        surveys.push({
          survey_id: surveyId,
          key: key,
          updated_at: file.LastModified,
          published: published,
        });
      } catch (error) {
        console.error(`Error processing survey ${key}:`, error);
        // Continue processing other surveys even if one fails
      }
    }

    // Filter based on query parameter
    const filteredSurveys = filter === 'all'
      ? surveys
      : surveys.filter(s => s.published);

    result = { surveys: filteredSurveys };
  } catch (error) {
    statusCode = 500;
    result = { error: 'Failed to list survey objects', details: String(error) };
  }

  return new Response(JSON.stringify(result), {
    status: statusCode,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    }
  });
}
