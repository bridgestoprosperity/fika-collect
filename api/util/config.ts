import { join } from 'path';
import { existsSync, readFileSync } from 'fs';
import { fileURLToPath } from "url";
import { dirname } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));

// Load development environment variables if the file exists. On production, these
// are expected to be set in the environment already, and this file will not exist.
//
// Also, this is awful, but __dirname is actually the location of dist files within
// packages/fika-collect-vercel, so we have to go up several directories to find
// the env.development.json file at the repo root. :(
const envPath = join(__dirname, "../../../../env.development.json");
if (existsSync(envPath)) {
  console.log(`Using development environment config from "${envPath}"`);
  const envConfig = JSON.parse(readFileSync(envPath, "utf-8"));
  Object.assign(process.env, envConfig);
}

const Bucket: string = process.env.S3_BUCKET as string;
const Region: string = process.env.AWS_REGION as string || 'us-west-2';
const Prefix = 'responses';
const MaxFileSize = 25 * 1024 * 1024;

export { Bucket, Region, MaxFileSize, Prefix };
