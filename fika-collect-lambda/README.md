# Fika Collect Lambda

## Introduction

This repo contains a AWS Lambda function for generating pre-signed AWS S3 URLs. In sequence:

1. Mobile client requests a pre-signed URL
2. Lambda responds with pre-signed URL
3. Mobile client posts photographs directly to S3
4. Upon success, mobile app updates survey response JSON to include S3 keys of assets
5. Mobile client posts survey response JSON to S3
6. Survey is successfully uploaded

## Development


```
npm run test
```

## Deployment

The current deploy procedures are a bit silly since SAM is not debugged, but it gets the job done. We use SAM to generate the build, but we then place it on Lambda manually by uploading a zip.

```bash
$ npm run build
```

This generates a ZIP archive, `fikaCollectUploadLambda.zip`. Although it's named for the upload pre-signer lambda, it has two entry points in `handler.js`, so we upload the same artifact for both Lambdas. Finally, navigate to the following pages and select "Upload from: .zip file" in the Code menu:

- [fikaCollectUploadLambda](https://us-west-1.console.aws.amazon.com/lambda/home?region=us-west-1#/functions/fikaCollectUploadLambda?subtab=triggers&tab=code)
- [fikaCollectSurveySubmitLambda](https://us-west-1.console.aws.amazon.com/lambda/home?region=us-west-1#/functions/fikaCollectSurveySubmitLambda?subtab=permissions&tab=code)



## Documentation

For endpoint documentation, see [API.md](./API.md).
