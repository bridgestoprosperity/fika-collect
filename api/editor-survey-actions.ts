import s3 from './util/s3.js';
import { PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { SurveySchema } from 'fika-collect-survey-schema';
//import type { Survey } from 'fika-collect-survey-schema';
import HTTPError from './util/httpError.js';
import { updateManifest } from './util/updateManifest.js';

const Bucket = process.env.S3_BUCKET || 'fika-collect';
const Prefix = 'surveys/';

// Route parameters are passed as query string parameters in both environments:
// - Vercel: vercel.json rewrites /surveys/:id to ?id=$id
// - Dev server: packages/fika-collect-vercel/server.js adds req.params to URL searchParams

export async function GET(request: Request) {
  const url = new URL(request.url);
  const id = url.searchParams.get('id');

  console.log('get', { id });

  if (!id) {
    return new Response(
      JSON.stringify({ error: 'Survey ID is required' }),
      {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      }
    );
  }

  try {
    const command = new GetObjectCommand({
      Bucket,
      Key: `${Prefix}${id}.json`,
    });

    const data = await s3.send(command);
    const bodyString = await data.Body?.transformToString();

    if (!bodyString) {
      throw new HTTPError(404, 'Survey not found');
    }

    const survey = JSON.parse(bodyString);

    return new Response(
      JSON.stringify(survey),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      }
    );
  } catch (error: any) {
    if (error.name === 'NoSuchKey') {
      return new Response(
        JSON.stringify({ error: 'Survey not found' }),
        {
          status: 404,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        }
      );
    }
    throw error;
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const surveyData = SurveySchema.safeParse(body);

    if (!surveyData.success) {
      return new Response(
        JSON.stringify({ error: 'Invalid survey data', details: surveyData.error }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        }
      );
    }

    const survey = surveyData.data;
    const command = new PutObjectCommand({
      Bucket,
      Key: `${Prefix}${survey.id}.json`,
      Body: JSON.stringify(survey, null, 2),
      ContentType: 'application/json',
    });

    await s3.send(command);

    // Update the manifest for backward compatibility with older clients
    await updateManifest(s3);

    return new Response(
      JSON.stringify({ success: true, survey_id: survey.id }),
      {
        status: 201,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      }
    );
  } catch (error: any) {
    console.error('Error creating survey:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to create survey' }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get('id');

    console.log({ id });

    if (!id) {
      return new Response(
        JSON.stringify({ error: 'Survey ID is required' }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        }
      );
    }

    const body = await request.json();
    const surveyData = SurveySchema.safeParse(body);

    console.log(surveyData);

    if (!surveyData.success) {
      return new Response(
        JSON.stringify({ error: 'Invalid survey data', details: surveyData.error }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        }
      );
    }

    const survey = surveyData.data;

    // Ensure the ID in the URL matches the ID in the body
    if (survey.id !== id) {
      return new Response(
        JSON.stringify({ error: 'Survey ID mismatch between URL and body' }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        }
      );
    }

    const command = new PutObjectCommand({
      Bucket,
      Key: `${Prefix}${id}.json`,
      Body: JSON.stringify(survey, null, 2),
      ContentType: 'application/json',
    });

    await s3.send(command);

    // Update the manifest for backward compatibility with older clients
    await updateManifest(s3);

    return new Response(
      JSON.stringify({ success: true, survey_id: id }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      }
    );
  } catch (error: any) {
    console.error('Error updating survey:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to update survey' }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get('id');

    if (!id) {
      return new Response(
        JSON.stringify({ error: 'Survey ID is required' }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        }
      );
    }

    const command = new DeleteObjectCommand({
      Bucket,
      Key: `${Prefix}${id}.json`,
    });

    await s3.send(command);

    // Update the manifest for backward compatibility with older clients
    await updateManifest(s3);

    return new Response(
      JSON.stringify({ success: true, survey_id: id }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      }
    );
  } catch (error: any) {
    console.error('Error deleting survey:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to delete survey' }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      }
    );
  }
}