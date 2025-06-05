import { S3Client } from "@aws-sdk/client-s3";
import { Region } from "../config.js";

const s3 = new S3Client({ region: Region });

export default s3;