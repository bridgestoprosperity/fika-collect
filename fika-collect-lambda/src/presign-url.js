import {Bucket, Prefix} from './config.js';
import HttpError from './http-error.js';

function extensionFromFileType(file_type) {
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
  {file_type, survey_id, response_id, image_id},
  {s3},
) {
  const ext = extensionFromFileType(file_type);
  const responseKey = `${survey_id}/${response_id}/response.json`;

  try {
    await s3.headObject({Bucket, Key: responseKey}).promise();
  } catch (error) {
    if (error.code === 'NotFound') {
      throw new HttpError(
        400,
        `Response at ${responseKey} must be submitted before uploading images`,
      );
    }
    throw error;
  }

  const Key = `${Prefix}/${survey_id}/${response_id}.${image_id}.${ext}`;

  const params = {
    Bucket,
    Key,
    ContentType: file_type,
    ACL: 'private',
    Expires: 5 * 60, // seconds
  };

  return await s3.getSignedUrlPromise('putObject', params);
}
