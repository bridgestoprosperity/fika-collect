import { Bucket, Prefix } from './config.js';
import HttpError from './httpError.js';
import { HeadObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
function extensionFromFileType(file_type) {
    switch (file_type) {
        case 'image/jpeg':
            return 'jpg';
        case 'image/png':
            return 'png';
        case 'image/heic':
            return 'heic';
        case 'image/webp':
            return 'webp';
        default:
            throw new Error(`Unknown file type: ${file_type}`);
    }
}
export default async function generatePresignedUrl(s3, { file_type, survey_id, response_id, image_id }) {
    const ext = extensionFromFileType(file_type);
    const responseKey = `${Prefix}/${survey_id}/${response_id}/response.json`;
    try {
        const headObjectCommand = new HeadObjectCommand({ Bucket, Key: responseKey });
        await s3.send(headObjectCommand);
    }
    catch (error) {
        if (error.name === 'NotFound') {
            throw new HttpError(400, `Response at ${responseKey} must be submitted before uploading images`);
        }
        throw error;
    }
    const Key = `${Prefix}/${survey_id}/${response_id}/${image_id}.${ext}`;
    const params = {
        Bucket,
        Key,
        ContentType: file_type,
        ACL: 'private',
    };
    const command = new PutObjectCommand(params);
    const signedUrl = await getSignedUrl(s3, command, { expiresIn: 5 * 60 }); // 5 minutes in seconds
    return signedUrl;
}
