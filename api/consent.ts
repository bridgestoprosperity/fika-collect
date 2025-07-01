import { z } from 'zod';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import HTTPError from './util/httpError.js';
const s3 = new S3Client({ region: 'us-east-1' });

const ConsentSchema = z.object({
  user_id: z.string().min(1, 'User ID is required.'),
  consent_text: z.string().min(1, 'Consent text is required.'),
  timestamp: z
    .string()
    .optional()
    .transform(val => val ?? new Date().toISOString())
    .refine(val => !isNaN(Date.parse(val)), {
      message: 'Invalid timestamp format. Must be a valid date string.',
    }),
});

export async function POST(request: Request): Promise<Response> {
  try {
    const consentData = ConsentSchema.safeParse(await request.json());
    if (!consentData.success) {
      throw new HTTPError(400, 'Invalid consent data');
    }

    const command = new PutObjectCommand({
      Bucket: process.env.S3_BUCKET || 'fika-collect',
      Key: `consent/${consentData.data.user_id}.json`,
    });

    command.input.Body = JSON.stringify(consentData.data);
    try {
      const result = await s3.send(command);
      if (result.$metadata.httpStatusCode !== 200) {
        throw new HTTPError(result.$metadata.httpStatusCode || 500, 'Failed to save consent data to S3');
      }
    } catch (err) {
      throw new HTTPError(500, 'Error saving consent data to S3');
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      }
    });
  } catch (error: unknown) {
    if (error instanceof HTTPError) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: error.statusCode,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });
    } else {
      console.error('Unexpected error in POST consent:', error);
      return new Response(JSON.stringify({ error: 'Internal server error' }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });
    }
  }
}
