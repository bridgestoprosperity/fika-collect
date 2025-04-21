import {Bucket, Prefix} from './config.js';

async function uploadResponseToS3(payload, {s3}) {
  const {survey_id, id} = payload;

  const key = `${Prefix}/${survey_id}/${id}/response.json`;

  const params = {
    Bucket,
    Key: key,
    Body: JSON.stringify(payload),
    ContentType: 'application/json',
  };

  await s3.putObject(params).promise();
  return {key};
}

export {uploadResponseToS3};
