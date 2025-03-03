import AWS from 'aws-sdk';
import crypto from 'crypto';

import {Bucket, Region, MaxFileSize} from './config.js';

const s3 = new AWS.S3({region: Region});

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
    Bucket,
    Key: filePath,
    ContentType: fileType,
    ACL: 'private',
    Expires: 5 * 60, // seconds
    Conditions: [['content-length-range', 0, MaxFileSize]],
  };

  return await s3.getSignedUrlPromise('putObject', params);
}
