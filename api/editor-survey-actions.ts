import s3 from './util/s3.js';
import { ListObjectsV2Command } from '@aws-sdk/client-s3';

const Bucket = process.env.S3_BUCKET || 'fika-collect';
const Prefix = 'surveys/';

export async function GET(request: Request) {
  const command = new ListObjectsV2Command({ Bucket, Prefix });

  const data = await s3.send(command);
  const surveys = data.Contents?.map(obj => ({
    survey_id: obj.Key,
    updated_at: obj.LastModified,
  })) || [];

  return new Response(
    JSON.stringify({ surveys }),
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
  return new Response(
    'post survey',
    {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    }
  );
}
export async function PUT(request: Request) {
  return new Response(
    'put survey',
    {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    }
  );
}
export async function DELETE(request: Request) {
  return new Response(
    'delete survey',
    {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    }
  );
}