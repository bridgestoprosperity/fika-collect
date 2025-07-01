const Bucket: string = process.env.S3_BUCKET as string;
const Region: string = process.env.AWS_REGION as string || 'us-west-2';
const Prefix = 'responses';
const MaxFileSize = 25 * 1024 * 1024;

export { Bucket, Region, MaxFileSize, Prefix };
