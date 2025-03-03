import AWS from 'aws-sdk';
import crypto from 'crypto';

const S3_BUCKET = process.env.S3_BUCKET;
const REGION = process.env.AWS_REGION || 'us-west-2';
const MAX_FILE_SIZE = 25 * 1024 * 1024; // 25 MB

const s3 = new AWS.S3({region: REGION});

function extensionFromFileType(fileType) {
  switch (fileType) {
    case 'image/jpeg':
      return 'jpg';
    case 'image/png':
      return 'png';
    case 'image/heic':
      return 'heic';
    case 'image/webp':
      return 'webp';
    default:
      throw new Error(`Unknown file type: ${fileType}`);
  }
}

export default async function generateSignedURL({fileType, surveyId}) {
  const ext = extensionFromFileType(fileType);
  const uuid = crypto.randomUUID();
  const filePath = `${surveyId}/${uuid}.${ext}`;

  const params = {
    Bucket: S3_BUCKET,
    Key: filePath,
    ContentType: fileType,
    ACL: 'private',
    Expires: 5 * 60, // seconds
    Conditions: [['content-length-range', 0, MAX_FILE_SIZE]],
  };

  const uploadURL = await s3.getSignedUrlPromise('putObject', params);

  return uploadURL;
}
