import { surveySubmissionRequestSchema, } from "./util/requestSchema.js";
import { fromError } from "zod-validation-error";
import { responseSchema } from "./util/responseSchema.js";
import { uploadResponseToS3 } from "./util/uploadResponse.js";
import HttpError from "./util/httpError.js";
import s3 from "./util/s3.js";
import type { ResponseType } from "./util/responseType.js";

/**
 * Handle submitted survey JSON
 *
 * @param {Object} event - The event object containing the request data.
 * @param {string} event.body - The JSON stringified body of the request.
 * @param {Object} event.body.response - The survey response json
 *
 * @returns {Object} The response object.
 * @returns {number} response.statusCode - The HTTP status code.
 * @returns {string} response.body - The JSON stringified body of the response.
 */
export async function POST(request: Request): Promise<Response> {
  try {
    const requestParams = surveySubmissionRequestSchema.safeParse(await request.json());

    if (!requestParams.success) {
      throw new HttpError(
        400,
        JSON.stringify({ error: fromError(requestParams.error).toString() })
      );
    }

    await uploadResponseToS3(requestParams.data.response, { s3 });

    return new Response(
      JSON.stringify({ success: true }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      }
    );
  } catch (error) {
    // Don't log errors in test mode
    if (process.env.NODE_ENV !== 'test') console.error(error);

    if (error instanceof HttpError) {
      return new Response(JSON.stringify(error.message), {
        status: error.statusCode,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });
    }
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500
    });
  }
}