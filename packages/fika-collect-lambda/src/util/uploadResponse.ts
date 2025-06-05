import { Bucket, Prefix } from '../config.js';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

interface Payload {
  survey_id: string;
  id: string;
  [key: string]: any; // To allow additional properties in the payload
}

async function uploadResponseToS3(payload: Payload, { s3 }: { s3: S3Client }): Promise<{ key: string }> {
  const { survey_id, id } = payload;

  const key = `${Prefix}/${survey_id}/${id}/response.json`;

  const params = {
    Bucket,
    Key: key,
    Body: JSON.stringify(payload),
    ContentType: 'application/json',
  };

  await s3.send(new PutObjectCommand(params));
  return { key };
}

export { uploadResponseToS3 };
