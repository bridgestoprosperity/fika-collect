import s3 from './util/s3.js';
import { ListObjectsV2Command, GetObjectCommand } from '@aws-sdk/client-s3';
import { SurveySchema, FileTypeSchema } from 'fika-collect-survey-schema';
import type { Survey } from 'fika-collect-survey-schema';

const Bucket = process.env.S3_BUCKET || 'fika-collect';
const Prefix = 'surveys/';

interface SurveyDescription {
  survey_id: string;
  title: string;
  updated_at: string | null;
  url: string;
  published: boolean;
}

export async function GET(request: Request) {
  const listCommand = new ListObjectsV2Command({ Bucket, Prefix });

  const data = await s3.send(listCommand);
  const surveyFiles = (data.Contents || []).filter(obj => {
    const key = obj.Key || '';
    // Skip the directory itself and non-.json files, and skip manifest.json
    return key !== Prefix && key.endsWith('.json') && key !== `${Prefix}manifest.json`;
  });

  const surveyItems: SurveyDescription[] = [];

  // Read each survey to get its published status and title
  for (const file of surveyFiles) {
    const key = file.Key!;
    const id = key.replace(Prefix, '').replace('.json', '');

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

      // Get the title in English, or the first available language, or fallback to ID
      const title = validatedSurvey.data.title?.en
        || Object.values(validatedSurvey.data.title || {})[0]
        || id;

      surveyItems.push({
        survey_id: id,
        title: title,
        url: `https://${Bucket}.s3.amazonaws.com/${key}`,
        updated_at: file.LastModified?.toISOString() || null,
        published: published,
      });
    } catch (error) {
      console.error(`Error processing survey ${key}:`, error);
      // Continue processing other surveys even if one fails
    }
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