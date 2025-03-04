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

## To do

- [x] check size of app binary
  - Baseline Flutter apps are around 4-5 MB.
  - Baseline React Native apps are around 10-14 MB.
  - The app in its current form is about 15-20 MB for Android. This is larger than for Flutter but within tolerance.
- [x] write lambda to generate pre-signed S3 URLs
- [ ] configure S3 bucket
- [ ] deploy lambda to AWS
- [ ] integrate camera utility into survey
- [ ] implement state management for uploads
- [ ] iterate on survey questions

## AWS Resources

The following AWS resources have been allocated to make this work.

- *IAM* [fika-collect-lambda-role](https://us-east-1.console.aws.amazon.com/iam/home?region=us-west-1#/roles/details/fika-collect-lambda-role?section=permissions): IAM role for Lambda which generates pre-signed S3 upload URLs. Has Lambda and S3 policies.
- *S3* [fika-collect](https://us-west-1.console.aws.amazon.com/s3/buckets/fika-collect?region=us-west-1&bucketType=general&tab=objects): Bucket for uploaded surveys and photos

## License

&copy; 2025 Bridges To Prosperity. MIT License.
