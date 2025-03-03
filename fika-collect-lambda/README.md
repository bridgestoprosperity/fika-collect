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

To test,

```
npm run test
```

## Deployment



## Documentation

For endpoint documentation, see [API.md](./API.md).
