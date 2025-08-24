# fika-collect-vercel

This directory contains supporting files for the Fika Collect Vercel API. The API endpoints live at `/api` due to the constraints of Vercel configuration, but the tests and a dev server live in this directory.


## Development

To start the dev server:

```bash
$ npm install
$ npm start
```

The dev server is a quick hack for local development since Vercel has weird tooling that requires you to be logged into Vercel in order to test a local server. It also is relatively difficult to satisfy both vercel TypeScript config and local development. So `npm start` runs `tsc` and builds to [./dist](./dist). You must rebuild after modifying the code. Sigh.

Confirm the server is functioning correctly at http://localhost:3000/api/v1/healthcheck.

## Testing

Unlike the dev server, the tests are run directly from the TypeScript source and do not require a build step. To test `/api` endpoints:

```bash
npm run test
```

Or to run tests in watch mode:

```bash
npm run test:watch
```

## Staging

There is not currently a staging server. Instead, the API is developed locally.

## Deployment

API endpoints are deployed upon push to the `main` branch of the [fika-collect](https://github.com/bridgestoprosperity/fika-collect) repository.

