import { presignUpload } from 'fika-collect-lambda/src/handler';

export async function GET(request: Request) {
  const body = await request.text();
  return presignUpload({ body });
}
