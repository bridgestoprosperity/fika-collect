# Vercel Function Endpoints

This directory contains Vercel endpoints that point to code in [packages/fika-collect-lambda](./packages/fika-collect-lambda). The endpoints were initially implemented for use on AWS Lambda and may still be deployed using AWS SAM in that project directory, however Lambda infrastructure will not be maintained moving forward. Deployment to Vercel happens automatically upon push.

This setup is in place because we were unable to configure a CAA (Certificate Authority Authorization) DNS record on Vercel, so that AWS Certificate Manager was therefore unable to obtain a certificate for the AWS API Gateway. This would prevent HTTPS from working. Instead, we just wrap the AWS Lambda functions in minimal code to expose them as Vercel Function endpoints.
