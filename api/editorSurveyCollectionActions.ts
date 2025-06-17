import s3 from './util/s3.js';
import { ListObjectsV2Command } from '@aws-sdk/client-s3';
import { SurveySchema, FileTypeSchema } from 'fika-collect-survey-schema';
import type { Survey } from 'fika-collect-survey-schema';

const Bucket = process.env.S3_BUCKET || 'fika-collect';
const Prefix = 'surveys/';

interface SurveyDescription {
  survey_id: string;
  updated_at: string | null;
  url: string;
}

export async function GET(request: Request) {
  const command = new ListObjectsV2Command({ Bucket, Prefix });

  const data = await s3.send(command);
  const surveys = data.Contents?.map(obj => ({
    key: obj.Key,
    updated_at: obj.LastModified,
  })) || [];

  const surveyItems: SurveyDescription[] = [];
  for (const survey of surveys) {
    const id = (survey.key || '').replace(Prefix, '').replace('.json', '');
    surveyItems.push({
      survey_id: id,
      url: `https://${Bucket}.s3.amazonaws.com/${survey.key}`,
      updated_at: survey?.updated_at?.toISOString() || null,
    });
  }

  return new Response(
    JSON.stringify({ surveys: surveyItems }),
    {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    }
  );
}

export async function POST(request: Request) {
  const body = await request.json();
  // Here you would handle the creation of a new survey
  // For now, we just return the received body
  return new Response(
    JSON.stringify({ message: 'Survey created', data: body }),
    {
      status: 201,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    }
  );
}