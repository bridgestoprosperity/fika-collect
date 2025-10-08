import { ListObjectsV2Command, GetObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';
import { SurveySchema } from 'fika-collect-survey-schema';
const Bucket = process.env.S3_BUCKET || 'fika-collect';
const Prefix = 'surveys/';
const ManifestKey = 'surveys/manifest.json';
/**
 * Updates the manifest.json file on S3 with all published surveys.
 * This is for backward compatibility with older mobile app versions that read directly from S3.
 *
 * The manifest should only include surveys where published === true.
 */
export async function updateManifest(s3) {
    try {
        // List all survey files
        const listCommand = new ListObjectsV2Command({ Bucket, Prefix });
        const data = await s3.send(listCommand);
        const surveyFiles = (data.Contents || []).filter(obj => {
            const key = obj.Key || '';
            // Skip the directory itself and non-.json files, and skip manifest.json
            return key !== Prefix && key.endsWith('.json') && key !== ManifestKey;
        });
        const manifestSurveys = [];
        // Read each survey to check its published status
        for (const file of surveyFiles) {
            const key = file.Key;
            try {
                // Fetch the survey from S3
                const getCommand = new GetObjectCommand({ Bucket, Key: key });
                const surveyData = await s3.send(getCommand);
                const bodyString = await surveyData.Body?.transformToString();
                if (!bodyString) {
                    console.warn(`Empty survey file: ${key}`);
                    continue;
                }
                const survey = JSON.parse(bodyString);
                const validatedSurvey = SurveySchema.safeParse(survey);
                if (!validatedSurvey.success) {
                    console.warn(`Invalid survey schema for ${key}:`, validatedSurvey.error);
                    continue;
                }
                // Only include published surveys in the manifest
                // Default to true if published field is not set (backward compatibility)
                const isPublished = validatedSurvey.data.published ?? true;
                if (isPublished) {
                    manifestSurveys.push({
                        survey_id: validatedSurvey.data.id,
                        key: key,
                        updated_at: file.LastModified?.toISOString() || new Date().toISOString(),
                    });
                }
            }
            catch (error) {
                console.error(`Error processing survey ${key}:`, error);
                // Continue processing other surveys even if one fails
            }
        }
        // Write the manifest file
        const manifest = {
            surveys: manifestSurveys,
        };
        const putCommand = new PutObjectCommand({
            Bucket,
            Key: ManifestKey,
            Body: JSON.stringify(manifest, null, 2),
            ContentType: 'application/json',
        });
        await s3.send(putCommand);
        console.log(`Manifest updated successfully with ${manifestSurveys.length} published surveys`);
    }
    catch (error) {
        console.error('Error updating manifest:', error);
        throw error;
    }
}
