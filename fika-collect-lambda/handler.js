import generateUploadURL from './src/generate-upload-url.js';
import {requestSchema} from './src/request-schema.js';
import {fromError} from 'zod-validation-error';
import {responseSchema} from './src/response-schema.js';

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
export default async function handler(event) {
  try {
    const requestBody = JSON.parse(event.body);
    const requestParams = requestSchema.safeParse(requestBody);

    console.log(fromError(requestParams.error).toString());

    if (!requestParams.success) {
      return responseSchema.parse({
        statusCode: 400,
        body: JSON.stringify({
          error: fromError(requestParams.error).toString(),
        }),
      });
    }

    const uploadURL = await generateUploadURL(requestParams.data);

    return responseSchema.parse({
      statusCode: 200,
      body: JSON.stringify({uploadURL}),
    });
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({error: 'Internal server error'}),
    };
  }
}
