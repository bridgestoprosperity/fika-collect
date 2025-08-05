# fika-collect

React Native survey app, together with supporting infrastructure.

## Components

There are five primary components which comprise the app. The organization leaves a bit to be desired but is as necessary to satisfy the requirements of the five components. Internal shared code lives naturally as workspaces in `packages`. However, the React Native app refuses to live in a workspace, and Vercel requires that API endpoints live in a top-level directory. So we are left with the following:

- [api](./api): Vercal API endpoints (must be in top level directory)
- [fika-collect-app](./fika-collect-app): React Native App (must not be in a workspace)
- [packages/fika-collect-lambda](./packages/fika-collect-lambda): (deprecated) AWS Lambda endpoints
- [packages/fika-survey-editor](./packages/fika-survey-editor): web-based survey editor
- [packages/fika-collect-survey-schema](./packages/fika-collect-survey-schema): shared survey schema parser

## License

&copy; 2025 Bridges To Prosperity. MIT License.
