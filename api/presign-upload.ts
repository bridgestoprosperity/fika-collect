import { uploadPresignerRequestSchema, } from "./util/requestSchema.js";
import generatePresignedUrl from "./util/presignUrl.js";
import { fromError } from "zod-validation-error";
import HttpError from "./util/httpError.js";
import s3 from "./util/s3.js";

/**
 * Vercel handler function to generate a pre-signed upload URL.
 * @module handler
 *
 * @param {Request} request - The request object.
 * @param {Object} request.body - The JSON body of the request.
 * @param {string} request.body.file_type - The type of the file to be uploaded.
 * @param {string} request.body.survey_id - The ID of the survey associated with the file.
 *
 * @returns {Response} The response object with uploadURL or error.
 *
 * @throws {Error} - If an error occurs during processing.
 */
export async function POST(request: Request) {
  try {
    const requestParams = uploadPresignerRequestSchema.safeParse(await request.json());

    if (!requestParams.success) {
      return new Response(
        JSON.stringify({
          error: fromError(requestParams.error).toString(),
        }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        }
      );
    }

    const uploadURL: string = await generatePresignedUrl(s3, requestParams.data);

    return new Response(
      JSON.stringify({ uploadURL }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      }
    );
  } catch (error: unknown) {
    // Don't log errors in test mode
    if (process.env.NODE_ENV !== 'test') console.error(error);

    if (error instanceof HttpError) {
      return new Response(
        JSON.stringify({ error: error.message }),
        {
          status: error.statusCode,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        }
      );
    }
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      }
    );
  }
}