import { presignUpload } from 'fika-collect-lambda/dist/handler.js';

export async function GET(request: Request) {
  const body = await request.text();
  return presignUpload({ body });
}
