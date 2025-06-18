export async function GET(request: Request) {
  const { S3Client, ListObjectsV2Command } = await import('@aws-sdk/client-s3');

  const s3 = new S3Client({ region: 'us-east-1' });
  const command = new ListObjectsV2Command({
    Bucket: 'fika-collect',
    Prefix: 'surveys/',
  });

  let statusCode = 200;
  let body: string;

  try {
    const data = await s3.send(command);
    body = JSON.stringify({
      objects: data.Contents?.map(obj => ({
        key: obj.Key,
        lastModified: obj.LastModified,
        size: obj.Size,
      })) || [],
    });
  } catch (error) {
    statusCode = 500;
    body = JSON.stringify({ error: 'Failed to list survey objects', details: String(error) });
  }
  console.log(body);

  return new Response(body, {
    status: statusCode,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    }
  });
}
