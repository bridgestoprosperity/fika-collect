# Vercel Function Endpoints

This directory contains Vercel endpoints that point to code in [packages/fika-collect-lambda](./packages/fika-collect-lambda). The endpoints were initially implemented for use on AWS Lambda and may still be deployed using AWS SAM in that project directory, however Lambda infrastructure will not be maintained moving forward. Deployment to Vercel happens automatically upon push.

This setup is in place because after development for Lambda, DNS configuration required migration from Lambda to Vercel. This occurred because Vercel—through which fikadigital.org is managed—limits DNS to a single CAA (Certificate Authority Authorization) record per domain. This prevents configuring both Vercel and AWS Certificate Manager to issue certificates for fikadigital.org, which in turn prevents configuring DNS for a stable domain or subdomain for the AWS Lambda endpoints.
