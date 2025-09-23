import { Bucket } from './util/config.js';
import s3 from './util/s3.js';
import { ListObjectsV2Command } from '@aws-sdk/client-s3';

const Prefix = 'surveys/';

export async function GET(request: Request) {
  const command = new ListObjectsV2Command({ Bucket, Prefix });

  let statusCode = 200;
  let result: any;

  try {
    const data = await s3.send(command);
    result = {
      "surveys": (data.Contents || [])?.map(obj => ({
        // This assumes the path is precisely `surveys/{survey_id}.json`:
        survey_id: obj.Key?.split('/')[1]?.split('.')[0] || null,
        key: obj.Key,
        updated_at: obj.LastModified,
      })).filter(({ key }) => key !== Prefix)
    };
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
