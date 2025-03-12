import {S3Client, GetObjectCommand} from '@aws-sdk/client-s3';
import {Buffer} from 'buffer';

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

async function printManifest() {
  try {
    const params = {
      Bucket,
      Key: manifestKey,
    };

    const command = new GetObjectCommand(params);
    const data = await s3.send(command);
    const manifest = JSON.parse(await streamToString(data.Body));
    console.log(JSON.stringify(manifest, null, 2));
  } catch (error) {
    console.error('Error fetching manifest:', error);
  }
}

printManifest();
