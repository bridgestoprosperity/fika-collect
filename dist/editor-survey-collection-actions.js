import s3 from './util/s3.js';
import { ListObjectsV2Command, GetObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';
import { SurveySchema } from 'fika-collect-survey-schema';
import { updateManifest } from './util/updateManifest.js';
const Bucket = process.env.S3_BUCKET || 'fika-collect';
const Prefix = 'surveys/';
export async function GET(request) {
    const listCommand = new ListObjectsV2Command({ Bucket, Prefix });
    const data = await s3.send(listCommand);
    const surveyFiles = (data.Contents || []).filter(obj => {
        const key = obj.Key || '';
        // Skip the directory itself and non-.json files, and skip manifest.json
        return key !== Prefix && key.endsWith('.json') && key !== `${Prefix}manifest.json`;
    });
    const surveyItems = [];
    // Read each survey to get its published status and title
    for (const file of surveyFiles) {
        const key = file.Key;
        const id = key.replace(Prefix, '').replace('.json', '');
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
            // Default to true if published field is not set (backward compatibility)
            const published = validatedSurvey.data.published ?? true;
            // Get the title in English, or the first available language, or fallback to ID
            const title = validatedSurvey.data.title?.en
                || Object.values(validatedSurvey.data.title || {})[0]
                || id;
            surveyItems.push({
                survey_id: id,
                title: title,
                url: `https://${Bucket}.s3.amazonaws.com/${key}`,
                updated_at: file.LastModified?.toISOString() || null,
                published: published,
            });
        }
        catch (error) {
            console.error(`Error processing survey ${key}:`, error);
            // Continue processing other surveys even if one fails
        }
    }
    return new Response(JSON.stringify({ surveys: surveyItems }), {
        status: 200,
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
        },
    });
}
export async function POST(request) {
    try {
        const body = await request.json();
        const surveyData = SurveySchema.safeParse(body);
        if (!surveyData.success) {
            return new Response(JSON.stringify({ error: 'Invalid survey data', details: surveyData.error }), {
                status: 400,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                },
            });
        }
        const survey = surveyData.data;
        // Check if survey already exists
        try {
            const existingCommand = new GetObjectCommand({
                Bucket,
                Key: `${Prefix}${survey.id}.json`,
            });
            const existingSurvey = await s3.send(existingCommand);
            // If we get here, the survey exists
            if (existingSurvey) {
                return new Response(JSON.stringify({ error: 'Survey already exists', details: `Survey with ID "${survey.id}" already exists` }), {
                    status: 409,
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*',
                    },
                });
            }
        }
        catch (error) {
            // NoSuchKey error means the survey doesn't exist, which is what we want
            if (error.name !== 'NoSuchKey') {
                throw error;
            }
        }
        // Create the survey
        const command = new PutObjectCommand({
            Bucket,
            Key: `${Prefix}${survey.id}.json`,
            Body: JSON.stringify(survey, null, 2),
            ContentType: 'application/json',
        });
        await s3.send(command);
        // Update the manifest for backward compatibility with older clients
        await updateManifest(s3);
        return new Response(JSON.stringify({ success: true, survey_id: survey.id }), {
            status: 201,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            },
        });
    }
    catch (error) {
        console.error('Error creating survey:', error);
        return new Response(JSON.stringify({ error: 'Failed to create survey' }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            },
        });
    }
}
