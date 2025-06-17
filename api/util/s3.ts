import { S3Client } from "@aws-sdk/client-s3";

const Region = process.env.AWS_REGION as string || "us-west-2";

const s3 = new S3Client({ region: Region });

export default s3;