import { Bucket, Prefix } from './config.js';
import { S3 } from 'aws-sdk';

interface Payload {
  survey_id: string;
  id: string;
  [key: string]: any; // To allow additional properties in the payload
}

interface S3Client {
  s3: S3;
}

async function uploadResponseToS3(payload: Payload, { s3 }: S3Client): Promise<{ key: string }> {
  const { survey_id, id } = payload;

  const key = `${Prefix}/${survey_id}/${id}/response.json`;

  const params = {
    Bucket,
    Key: key,
    Body: JSON.stringify(payload),
    ContentType: 'application/json',
  };

  await s3.putObject(params).promise();
  return { key };
}

export { uploadResponseToS3 };
