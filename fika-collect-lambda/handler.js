import generatePresignedUrl from './src/presign-url.js';
import AWS from 'aws-sdk';
import {
  uploadPresignerRequestSchema,
  surveySubmissionRequestSchema,
} from './src/request-schema.js';
import {fromError} from 'zod-validation-error';
import {responseSchema} from './src/response-schema.js';
import {uploadResponseToS3} from './src/upload-response.js';
import HttpError from './src/http-error.js';

import {Region} from './src/config.js';

const s3 = new AWS.S3({region: Region});

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
async function submitSurvey(event) {
  try {
    const requestBody = JSON.parse(event.body);
    const requestParams = surveySubmissionRequestSchema.safeParse(requestBody);

    if (!requestParams.success) {
      throw new HttpError(
        400,
        JSON.stringify({error: fromError(requestParams.error).toString()}),
      );
    }

    await uploadResponseToS3(requestParams.data.response, {s3});

    return responseSchema.parse({
      statusCode: 200,
      body: JSON.stringify({success: true}),
    });
  } catch (error) {
    if (error instanceof HttpError) {
      return {
        statusCode: error.statusCode,
        body: error.message,
      };
    }
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({error: 'Internal server error'}),
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
async function presignUpload(event) {
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

    const uploadURL = await generatePresignedUrl(requestParams.data, {s3});

    return responseSchema.parse({
      statusCode: 200,
      body: JSON.stringify({uploadURL}),
    });
  } catch (error) {
    if (error instanceof HttpError) {
      return {
        statusCode: error.statusCode,
        body: error.message,
      };
    }
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({error: 'Internal server error'}),
    };
  }
}

export {presignUpload, submitSurvey, s3};
