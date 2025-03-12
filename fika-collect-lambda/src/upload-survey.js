import {Bucket} from './config.js';

async function uploadSurveyToS3(payload, {s3}) {
  const {survey_id, id} = payload;

  const key = `responses/${survey_id}/${id}/response.json`;

  const params = {
    Bucket,
    Key: key,
    Body: JSON.stringify(payload),
    ContentType: 'application/json',
  };

  await s3.putObject(params).promise();
  return {key};
}

export {uploadSurveyToS3};
