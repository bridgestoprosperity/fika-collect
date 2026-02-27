# fika-collect

React Native survey app, together with supporting infrastructure.

## Development

To use the development server, you must copy [env.development.json.sample](./env.development.json.sample) to a file in the root project directory named `env.development.json` and update its values. You will need a access key and secret key for the fika-collect-vercel-develop IAM user which you may create [here](https://us-east-1.console.aws.amazon.com/iam/home?region=us-west-1#/users/details/fika-collect-vercel-develop?section=permissions).

navigate to `fika-collect/fika-collect-app`
```sh
cd fika-collect-app
npm start
```

then run navigate to `fika-collect/packages/fika-collect-vercel`
and run:
` npm start`

then start the android emulator by navigating to:
`fika-collect/fika-collect-app`
and running
`npm run android`

Confirm the local server is running at http://localhost:3000/api/v1/surveys.

To build, navigate to `fika-collect/fika-collect-app/android` and run
`./gradlew bundleRelease`

Release will be located at `fika-collect/fika-collect-app/android/app/build/outputs/bundle/release/app-release.aab`

## Components

There are four primary components which comprise the app. The organization leaves a bit to be desired but is as necessary to satisfy the requirements of the four components. Internal shared code lives naturally as workspaces in `packages`. However, the React Native app refuses to live in a workspace, and Vercel requires that API endpoints live in a top-level directory. So we are left with the following:

- [api/](./api): Vercel API endpoints
- [fika-collect-app/](./fika-collect-app): React Native App
- [packages/fika-collect-survey-editor/](./packages/fika-collect-survey-editor): web-based survey editor
- [packages/fika-collect-survey-schema/](./packages/fika-collect-survey-schema): shared survey schema parser
- [packages/fika-collect-vercel/](./packages/fika-collect-vercel): Dummy package to coordinate tests and dev server for Vercel endpoints in [api/](./api)
- ~~[packages/fika-collect-lambda/](./packages/fika-collect-lambda): (deprecated) AWS Lambda endpoints~~

## License

&copy; 2025 Bridges To Prosperity. MIT License.
