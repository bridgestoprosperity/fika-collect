import {S3Client, GetObjectCommand} from '@aws-sdk/client-s3';
import {Buffer} from 'buffer';
import {PutObjectCommand} from '@aws-sdk/client-s3';
import {argv} from 'process';

const Prefix = 'surveys';
const Bucket = 'fika-collect';
const manifestKey = 'surveys/manifest.json';

const s3 = new S3Client({region: 'us-west-1'});

function streamToString(stream) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    stream.on('data', chunk => chunks.push(chunk));
    stream.on('error', reject);
    stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
  });
}

const surveyId = argv[2];
if (!surveyId) {
  console.error('Please provide a survey_id as a CLI argument.');
  process.exit(1);
}

try {
  const params = {
    Bucket,
    Key: manifestKey,
  };

  const command = new GetObjectCommand(params);
  const data = await s3.send(command);
  const manifest = JSON.parse(await streamToString(data.Body));

  const surveyIndex = manifest.surveys.findIndex(
    survey => survey.key === `${Prefix}/${surveyId}.json`,
  );

  if (surveyIndex === -1) {
    console.error(`Survey with id '${surveyId}' not found in the manifest.`);
    process.exit(1);
  }

  const updatedSurveys = [...manifest.surveys];
  updatedSurveys.splice(surveyIndex, 1);

  const putParams = {
    Bucket,
    Key: manifestKey,
    Body: JSON.stringify(manifest),
    ContentType: 'application/json',
  };

  const putCommand = new PutObjectCommand(putParams);
  await s3.send(putCommand);

  console.log('Survey deactivated successfully.');
} catch (error) {
  console.error('Error processing manifest:', error);
}
