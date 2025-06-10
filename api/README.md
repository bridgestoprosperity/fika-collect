# Vercel Function Endpoints

This directory contains Vercel endpoints that point to code in [packages/fika-collect-lambda](./packages/fika-collect-lambda). The endpoints were initially implemented for use on AWS Lambda and may still be deployed using AWS SAM in that project directory, however Lambda infrastructure will not be maintained moving forward. Deployment to Vercel happens automatically upon push.

This setup is in place because we were unable to configure a CAA (Certificate Authority Authorization) DNS record on Vercel, so that AWS Certificate Manager was therefore unable to obtain a certificate for the AWS API Gateway. This would prevent HTTPS from working. Instead, we just wrap the AWS Lambda functions in minimal code to expose them as Vercel Function endpoints.

## Endpoints

## GET `/surveys`

List all surveys

**Parameters**

| Name     | Type                   | Default       |
| -------- | ---------------------- | ------------- |
| `filter` | `"published" \| "all"` | `"published"` |

## POST `/surveys`

Create a survey.

- Store survey on S3 under `/surveys/{survey_id}`.
- Update `manifest.json`
- Reflect desired published/unpublished state of new survey.
- Return 201 CREATED with id and key of created survey.

## PUT `/surveys/:survey_id`

Update a survey.

- Store new version of survey under the appropriate key.
- Update `manifest.json` to reflect published/unpublished state of survey.
- Return 200 OK with id and key of updated survey.

## POST `/presign-upload`

- Check for existence of corresponding survey
- Validate request details against survey schema
- Return 200 OK presigned S3 URL to which image may be posted

## POST `/submit-survey`

-
