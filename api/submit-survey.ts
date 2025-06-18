import { submitSurvey } from 'fika-collect-lambda/dist/handler.js';

interface LambdaResponse {
  statusCode: number;
  body: string;
}

export async function POST(request: Request) {
  const { statusCode, body } = await submitSurvey({ body: await request.text() }) as LambdaResponse;

  return new Response(body, {
    status: statusCode,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    }
  });
}
