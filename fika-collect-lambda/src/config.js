const Bucket = process.env.S3_BUCKET;
const Region = process.env.AWS_REGION || 'us-west-2';
const MaxFileSize = 25 * 1024 * 1024;

export {Bucket, Region, MaxFileSize};
