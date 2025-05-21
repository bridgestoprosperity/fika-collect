import { presignUpload } from 'fika-collect-lambda/dist/handler.js';
import HttpError from 'fika-collect-lambda/dist/httpError.js';

export async function POST(request: Request) {
  try {
    const body = await request.text();
    return presignUpload({ body });
  } catch (error) {
    if (error instanceof HttpError) {
      return new Response(error.message, { status: error.statusCode });
    }
    return new Response('Internal server error', { status: 500 });
  }
}
