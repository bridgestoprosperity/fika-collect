import { Bucket, Prefix } from './config.js';
import HttpError from './httpError.js';
import { S3 } from 'aws-sdk';

type FileType = 'image/jpeg' | 'image/png' | 'image/heic' | 'image/webp';

interface GeneratePresignedUrlParams {
  file_type: FileType;
  survey_id: string;
  response_id: string;
  image_id: string;
}

interface S3Client {
  s3: S3;
}

function extensionFromFileType(file_type: FileType): string {
  switch (file_type) {
    case 'image/jpeg':
      return 'jpg';
    case 'image/png':
      return 'png';
    case 'image/heic':
      return 'heic';
    case 'image/webp':
      return 'webp';
    default:
      throw new Error(`Unknown file type: ${file_type}`);
  }
}

export default async function generatePresignedUrl(
  { file_type, survey_id, response_id, image_id }: GeneratePresignedUrlParams,
  { s3 }: S3Client,
): Promise<string> {
  const ext = extensionFromFileType(file_type);
  const responseKey = `${Prefix}/${survey_id}/${response_id}/response.json`;

  try {
    await s3.headObject({ Bucket, Key: responseKey }).promise();
  } catch (error: any) {
    if (error.code === 'NotFound') {
      throw new HttpError(
        400,
        `Response at ${responseKey} must be submitted before uploading images`,
      );
    }
    throw error;
  }

  const Key = `${Prefix}/${survey_id}/${response_id}/${image_id}.${ext}`;

  const params = {
    Bucket,
    Key,
    ContentType: file_type,
    ACL: 'private',
    Expires: 5 * 60, // seconds
  };

  return await s3.getSignedUrlPromise('putObject', params);
}
