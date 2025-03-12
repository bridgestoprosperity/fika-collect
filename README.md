# fika-collect

React Native implementation of our Fika Collect application.

## Getting started

To configure your environment and get started, follow the React Native template docs in [getting-started.md](./docs/getting-started.md).

## Building

To build for iOS and Android, respectively:

```bash
npx react-native build-ios --mode=Release
```

```bash
npx react-native build-android --mode=release
```

Android outputs may be found in `android/app/build/outputs/apk/release`. To reduce the size of binaries, per-CPU binaries are built as separate APKs. All APKs should be sent to Google Play store.

## AWS Resources

The following AWS resources have been allocated to make the lambda run.

- **Lambda**
  - [fikaCollectUploadLambda](https://us-west-1.console.aws.amazon.com/lambda/home?region=us-west-1#/functions/fikaCollectUploadLambda?tab=code): AWS Lambda for creating signed upload URLs
- **IAM**
  - [fika-collect-lambda-role](https://us-east-1.console.aws.amazon.com/iam/home?region=us-west-1#/roles/details/fika-collect-lambda-role?section=permissions): IAM role for fikaCollectUploadLambda. Has sufficient permissions to generate pre-signed S3 upload URLs.
  - [fika-collect-deploy-user](https://us-east-1.console.aws.amazon.com/iam/home?region=us-west-1#/users/details/fika-collect-lambda-deploy?section=permissions): IAM user (with access/secret keys) for deploying lambda via SAM. [AWS SSO](https://aws.amazon.com/iam/identity-center/) would be a preferable alternative.
- **S3**
  - [fika-collect](https://us-west-1.console.aws.amazon.com/s3/buckets/fika-collect?region=us-west-1&bucketType=general&tab=objects): Bucket for uploaded surveys JSON and associated photos
  - [aws-sam-cli-managed-default-samclisourcebucket-ur3ghtnobrtr](https://us-west-1.console.aws.amazon.com/s3/buckets/aws-sam-cli-managed-default-samclisourcebucket-ur3ghtnobrtr?region=us-west-1&bucketType=general&tab=objects): Bucket for [SAM](https://aws.amazon.com/serverless/sam/)-managed deployment of fikaCollectUploadLambda. Contains zipped lambda code. *Contains  no user-uploaded data.*
- **CloudFormation**
  - [aws-sam-cli-managed-default](https://us-west-1.console.aws.amazon.com/cloudformation/home?region=us-west-1#/stacks/stackinfo?filteringText=&filteringStatus=active&viewNested=true&stackId=arn%3Aaws%3Acloudformation%3Aus-west-1%3A530198286110%3Astack%2Faws-sam-cli-managed-default%2F3425f030-f931-11ef-a23c-02a70af48729): Stack for managing SAM deployments
  - [fika-collect-upload-signer](https://us-west-1.console.aws.amazon.com/cloudformation/home?region=us-west-1#/stacks/stackinfo?filteringText=&filteringStatus=active&viewNested=true&stackId=arn%3Aaws%3Acloudformation%3Aus-west-1%3A530198286110%3Astack%2Ffika-collect-upload-signer%2F5704f0b0-f931-11ef-adc1-029a61d41e27): Stack for fikaCollectUploadLambda
- **API Gateway**
  - [fika-collect-api](https://us-west-1.console.aws.amazon.com/apigateway/main/develop/routes?api=f54u12dkn2&region=us-west-1). An API Gateway allows to orgzniae multiple lambda functions as a coherent API instead of sending every request to a different lambda URL.


## License

&copy; 2025 Bridges To Prosperity. MIT License.
