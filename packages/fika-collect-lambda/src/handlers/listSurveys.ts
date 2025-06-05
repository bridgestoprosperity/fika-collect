import { fromError } from "zod-validation-error";
import { responseSchema } from "../util/responseSchema.js";
import HttpError from "../util/httpError.js";
import s3 from "../util/s3.js";
import { ListObjectsV2Command } from '@aws-sdk/client-s3';

import { Bucket } from "../config.js";

const Prefix = 'surveys/';

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
async function listSurveys(event: { body: string }): Promise<{ statusCode: number; body: string }> {
  try {
    //const requestBody = JSON.parse(event.body);

    const command = new ListObjectsV2Command({ Bucket, Prefix });

    const data = await s3.send(command);
    const surveys = data.Contents?.map(obj => ({
      survey_id: obj.Key,
      updated_at: obj.LastModified,
    })) || [];

    console.log({ surveys });

    return responseSchema.parse({
      statusCode: 200,
      body: JSON.stringify({ surveys }),
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

export default listSurveys;
