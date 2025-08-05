# fika-collect

React Native survey app, together with supporting infrastructure.

## Components

The commponents are just a bit of a mess since each component has its own preferences. Internal shared code lives naturally as workspaces in `packages`. However, the React Native app refuses to live in a workspace, and Vercel requires that API endpoints live in a top-level directory. So we have the following:

- [api](./api): Vercal API endpoints (must be in top level directory)
- [fika-collect-app](./fika-collect-app): React Native App (must not be in a workspace)
- [packages/fika-collect-lambda](./packages/fika-collect-lambda): (deprecated) AWS Lambda endpoints
- [packages/fika-survey-editor](./packages/fika-survey-editor): web-based survey editor
- [packages/fika-collect-survey-schema](./packages/fika-collect-survey-schema): shared survey schema parser

## License

&copy; 2025 Bridges To Prosperity. MIT License.
