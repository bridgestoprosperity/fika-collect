# fika-collect

React Native survey app, together with supporting infrastructure.

## AWS Resources

The following AWS resources have been allocated to make the lambda run.

- **Lambda**
  - [fikaCollectSurveySubmitLambda](https://us-west-1.console.aws.amazon.com/lambda/home?region=us-west-1#/functions/fikaCollectSurveySubmitLambda?tab=code): AWS Lambda for submitting surveys.
  - [fikaCollectUploadLambda](https://us-west-1.console.aws.amazon.com/lambda/home?region=us-west-1#/functions/fikaCollectUploadLambda?tab=code): AWS Lambda for creating signed upload URLs. Ensures a corresponding survey has first been submitted.
- **IAM**
  - [fika-collect-lambda-role](https://us-east-1.console.aws.amazon.com/iam/home?region=us-west-1#/roles/details/fika-collect-lambda-role?section=permissions): IAM role for fikaCollectUploadLambda. Has sufficient permissions to generate pre-signed S3 upload URLs.
  - [fika-collect-deploy-user](https://us-east-1.console.aws.amazon.com/iam/home?region=us-west-1#/users/details/fika-collect-lambda-deploy?section=permissions): IAM user (with access/secret keys) for deploying lambda via SAM. [AWS SSO](https://aws.amazon.com/iam/identity-center/) would be a preferable alternative.
- **S3**
  - [fika-collect](https://us-west-1.console.aws.amazon.com/s3/buckets/fika-collect?region=us-west-1&bucketType=general&tab=objects): Bucket for uploaded surveys JSON and associated photos. There are three subdirectories, public visibility of which is handled by way of a bucket policy:
    - `announcements/*`: **_Publicly accessible_** directory containing app announcements
    - `surveys/*`: **_Publicly accessible_** directory containing survey definitions and the active `manifest.json`.
    - `responses/*`: Private directory containing survey responses.
  - [aws-sam-cli-managed-default-samclisourcebucket-ur3ghtnobrtr](https://us-west-1.console.aws.amazon.com/s3/buckets/aws-sam-cli-managed-default-samclisourcebucket-ur3ghtnobrtr?region=us-west-1&bucketType=general&tab=objects): Bucket for [SAM](https://aws.amazon.com/serverless/sam/)-managed deployment of fikaCollectUploadLambda. Contains zipped lambda code. _Contains no user-uploaded data._
- **CloudFormation** (_inactive_)
  - [aws-sam-cli-managed-default](https://us-west-1.console.aws.amazon.com/cloudformation/home?region=us-west-1#/stacks/stackinfo?filteringText=&filteringStatus=active&viewNested=true&stackId=arn%3Aaws%3Acloudformation%3Aus-west-1%3A530198286110%3Astack%2Faws-sam-cli-managed-default%2F3425f030-f931-11ef-a23c-02a70af48729): Stack for managing SAM deployments
  - [fika-collect-upload-signer](https://us-west-1.console.aws.amazon.com/cloudformation/home?region=us-west-1#/stacks/stackinfo?filteringText=&filteringStatus=active&viewNested=true&stackId=arn%3Aaws%3Acloudformation%3Aus-west-1%3A530198286110%3Astack%2Ffika-collect-upload-signer%2F5704f0b0-f931-11ef-adc1-029a61d41e27): Stack for fikaCollectUploadLambda
- **API Gateway**
  - [fika-collect-api](https://us-west-1.console.aws.amazon.com/apigateway/main/develop/routes?api=f54u12dkn2&region=us-west-1). An API Gateway allows to orgzniae multiple lambda functions as a coherent API instead of sending every request to a different lambda URL.

## License

&copy; 2025 Bridges To Prosperity. MIT License.

