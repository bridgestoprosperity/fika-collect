import {surveySchema} from '../../fika-collect-lambda/src/request-schema.js';
import {readFile} from 'node:fs/promises';
import yargs from 'yargs';
import {Buffer} from 'buffer';

import {
  S3Client,
  PutObjectCommand,
  HeadObjectCommand,
  GetObjectCommand,
} from '@aws-sdk/client-s3';

function streamToString(stream) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    stream.on('data', chunk => chunks.push(chunk));
    stream.on('error', reject);
    stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
  });
}

const s3 = new S3Client({
  region: 'us-west-1',
  endpoint: 'https://s3.us-west-1.amazonaws.com',
});

const Bucket = 'fika-collect';
const Prefix = 'surveys';

const argv = yargs(process.argv.slice(2))
  .usage('Usage: $0 <schemaFile> [options]')
  .demandCommand(1, 'You need to provide the schema file')
  .option('replace', {
    alias: 'r',
    type: 'boolean',
    description: 'Replace existing survey if it exists',
  }).argv;

const schemaFile = argv._[0];

try {
  const data = await readFile(schemaFile, 'utf8');
  const schema = JSON.parse(data);

  const surveyKey = await putSurvey(schema, {replace: argv.replace});
  await updateManifest(surveyKey);
} catch (err) {
  console.error(`Error uploading survey: ${err}`);
  process.exit(1);
}

async function checkObjectExists(Key) {
  try {
    const headParams = {Bucket, Key};
    await s3.send(new HeadObjectCommand(headParams));
    return true;
  } catch (err) {
    console.log("Object doesn't exist");
  }
  return false;
}

async function getManifest() {
  const Key = `${Prefix}/manifest.json`;
  try {
    const data = await s3.send(new GetObjectCommand({Bucket, Key}));
    const body = await streamToString(data.Body);

    const manifest = JSON.parse(body);

    const uniqueSurveys = [];
    const surveyKeys = new Set();

    for (const survey of manifest.surveys) {
      if (!surveyKeys.has(survey.key)) {
        surveyKeys.add(survey.key);
        uniqueSurveys.push(survey);
      }
    }

    manifest.surveys = uniqueSurveys;
    return manifest;
  } catch (err) {
    return {surveys: []};
  }
}

async function updateManifest(Key) {
  const survey_id = Key.split('/').pop().split('.').shift();
  const manifest = await getManifest();

  if (!manifest.surveys.some(survey => survey.key === Key)) {
    manifest.surveys.push({
      survey_id,
      key: Key,
      updated_at: new Date().toISOString(),
    });
  }
  const params = {
    Bucket,
    Key: `${Prefix}/manifest.json`,
    Body: JSON.stringify(manifest),
    ContentType: 'application/json',
  };

  try {
    await s3.send(new PutObjectCommand(params));
    console.log('Manifest updated successfully');
  } catch (err) {
    console.error('Error updating manifest:', err);
    process.exit(1);
  }
}

async function putSurvey(schema, {replace = false} = {}) {
  const parsed = surveySchema.parse(schema);

  const Key = `${Prefix}/${parsed.id}.json`;

  const surveyExists = await checkObjectExists(Key);

  if (surveyExists && !replace) {
    console.error('Survey already exists. Use --replace to overwrite');
    process.exit(1);
  }

  const params = {
    Bucket,
    Key,
    Body: JSON.stringify(parsed),
    ContentType: 'application/json',
  };

  try {
    const result = await s3.send(new PutObjectCommand(params));
    console.log('Survey uploaded successfully:', result);
    return Key;
  } catch (err) {
    console.error('Error uploading survey to S3:', err);
    process.exit(1);
  }
}
