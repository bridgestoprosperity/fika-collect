# Fika Collect Lambda

## Introduction

This package directory contains legacy AWS Lambda configuration which could potentially come in handy if part of the project ever needs to be repeatably deployed to AWS Lambda.

**However**, Vercel Functions require that the API code live in a top-level [api/](../../api) directory. Thus, all endpoints have been moved there instead.

**Instead**, this directory now only contains Python code for connection to Salesforce.

## Deployment

To use this AWS Lambda deployment configuration, you will need to install the [AWS SAM CLI](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/install-sam-cli.html).

```bash
sam build
sam deploy
```

This will deploy a stack as defined in [samconfig.toml](./samconfig.toml) and [template.yaml](./template.yaml).

The deploy user is defined as [fika-collect-lambda-deploy](https://us-east-1.console.aws.amazon.com/iam/home?region=us-west-1#/users/details/fika-collect-lambda-deploy?section=permissions) and the policy—this is the challenging part—is defined as [fika-collect-deploy-user-policy](https://us-east-1.console.aws.amazon.com/iam/home?region=us-west-1#/policies/details/arn%3Aaws%3Aiam%3A%3A530198286110%3Apolicy%2Ffika-collect-deploy-user-policy?section=versions). All components of the policy have been added piecemeal until `sam deploy` succeeds. If you're not willing to write wildcard policies that enable anything and everything—which you shouldn't!—determining the minimum required set of permissions is quite tedious!
