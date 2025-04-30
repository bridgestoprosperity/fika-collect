import generatePresignedUrl from "./presignUrl.js";
import { S3Client } from "@aws-sdk/client-s3";
import {
  uploadPresignerRequestSchema,
  surveySubmissionRequestSchema,
} from "./requestSchema.js";
import { fromError } from "zod-validation-error";
import { responseSchema } from "./responseSchema.js";
import { uploadResponseToS3 } from "./uploadResponse.js";
import HttpError from "./httpError.js";

import { Region } from "./config.js";
import { request } from "node:http";

const s3 = new S3Client({ region: Region });

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
async function submitSurvey(event: { body: string }): Promise<{ statusCode: number; body: string }> {
  try {
    const requestBody = JSON.parse(event.body);
    const requestParams = surveySubmissionRequestSchema.safeParse(requestBody);

    if (!requestParams.success) {
      throw new HttpError(
        400,
        JSON.stringify({ error: fromError(requestParams.error).toString() })
      );
    }

    await uploadResponseToS3(requestParams.data.response, { s3 });

    return responseSchema.parse({
      statusCode: 200,
      body: JSON.stringify({ success: true }),
    });
  } catch (error) {
    // Don't log errors in test mode
    if (process.env.NODE_ENV !== 'test') console.error(error);

    if (error instanceof HttpError) {
      return {
        statusCode: error.statusCode,
        body: error.message,
      };
    }
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Internal server error" }),
    };
  }
}

/**
 * Lambda handler function to generate a pre-signed upload URL.
 * @module handler
 *
 * @param {Object} event - The event object containing the request data.
 * @param {string} event.body - The JSON stringified body of the request.
 * @param {Object} event.body.file_type - The type of the file to be uploaded.
 * @param {Object} event.body.survey_id - The ID of the survey associated with the file.
 *
 * @returns {Object} The response object.
 * @returns {number} response.statusCode - The HTTP status code.
 * @returns {string} response.body - The JSON stringified body of the response.
 * @returns {Object} response.body.uploadURL - The pre-signed URL for file upload (on success).
 * @returns {Object} response.body.error - The error message (on failure).
 *
 * @throws {Error} - If an error occurs during processing.
 */
async function presignUpload(event: { body: string }): Promise<{ statusCode: number; body: string }> {
  try {
    const requestBody = JSON.parse(event.body);
    const requestParams = uploadPresignerRequestSchema.safeParse(requestBody);

    if (!requestParams.success) {
      return responseSchema.parse({
        statusCode: 400,
        body: JSON.stringify({
          error: fromError(requestParams.error).toString(),
        }),
      });
    }

    const uploadURL: string = await generatePresignedUrl(s3, requestParams.data);

    return responseSchema.parse({
      statusCode: 200,
      body: JSON.stringify({ uploadURL }),
    });
  } catch (error: unknown) {
    // Don't log errors in test mode
    if (process.env.NODE_ENV !== 'test') console.error(error);

    if (error instanceof HttpError) {
      return {
        statusCode: error.statusCode,
        body: error.message,
      };
    }
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Internal server error" }),
    };
  }
}

export { presignUpload, submitSurvey, s3 };
