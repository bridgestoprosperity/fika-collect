import { surveySubmissionRequestSchema, } from "../util/requestSchema.js";
import { fromError } from "zod-validation-error";
import { responseSchema } from "../util/responseSchema.js";
import { uploadResponseToS3 } from "../util/uploadResponse.js";
import HttpError from "../util/httpError.js";
import s3 from "../util/s3.js";
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
            throw new HttpError(400, JSON.stringify({ error: fromError(requestParams.error).toString() }));
        }
        await uploadResponseToS3(requestParams.data.response, { s3 });
        return responseSchema.parse({
            statusCode: 200,
            body: JSON.stringify({ success: true }),
        });
    }
    catch (error) {
        // Don't log errors in test mode
        if (process.env.NODE_ENV !== 'test')
            console.error(error);
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
export default submitSurvey;
