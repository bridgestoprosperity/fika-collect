import { Bucket, Prefix } from './config.js';
import HttpError from './httpError.js';
import { S3Client, HeadObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

type FileType = 'image/jpeg' | 'image/png' | 'image/heic' | 'image/webp';

interface GeneratePresignedUrlParams {
  file_type: FileType;
  survey_id: string;
  response_id: string;
  image_id: string;
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

export default async function generatePresignedUrl(s3: S3Client,
  { file_type, survey_id, response_id, image_id }: GeneratePresignedUrlParams,
): Promise<string> {
  const ext = extensionFromFileType(file_type);
  const responseKey = `${Prefix}/${survey_id}/${response_id}/response.json`;

  try {
    const headObjectCommand = new HeadObjectCommand({ Bucket, Key: responseKey });
    await s3.send(headObjectCommand);
  } catch (error: any) {
    if (error.name === 'NotFound') {
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
    ACL: 'private' as const,
  };

  const command = new PutObjectCommand(params);
  const signedUrl = await getSignedUrl(s3, command, { expiresIn: 5 * 60 }); // 5 minutes in seconds
  return signedUrl;
}
