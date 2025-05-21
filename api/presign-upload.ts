import { presignUpload } from 'fika-collect-lambda/dist/handler.js';
import HttpError from 'fika-collect-lambda/dist/httpError.js';

export async function POST(request: Request) {
  const { statusCode, body } = await presignUpload({ body: await request.text() });

  return new Response(body, {
    status: statusCode,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    }
  });
}
