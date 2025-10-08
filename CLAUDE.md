# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Fika Collect is a React Native survey application with supporting infrastructure for Bridges To Prosperity. The system consists of a mobile app, web-based survey editor, and serverless API endpoints deployed on Vercel.

## Project Structure

The codebase is organized as follows due to technical constraints (React Native won't work in workspaces, Vercel requires top-level API directory):

- **`api/`** - Vercel serverless function endpoints (deployed automatically on push)
- **`fika-collect-app/`** - React Native mobile app (iOS & Android)
- **`packages/fika-collect-survey-editor/`** - Web-based survey editor React app
- **`packages/fika-collect-survey-schema/`** - Shared Zod schema for survey validation
- **`packages/fika-collect-vercel/`** - Dev server and tests for Vercel endpoints
- **`packages/fika-collect-lambda/`** - (deprecated) Original AWS Lambda implementation

## Development Commands

### API Development Server

The local dev server proxies Vercel API endpoints:

```bash
cd packages/fika-collect-vercel
npm start  # Runs on http://localhost:3000
```

Before starting, copy `env.development.json.sample` to `env.development.json` in the root and add AWS credentials for the `fika-collect-vercel-develop` IAM user.

Verify server: http://localhost:3000/api/v1/surveys

### React Native App

```bash
cd fika-collect-app
npm run android        # Run Android app
npm run ios            # Run iOS app
npm start              # Start Metro bundler
npm test               # Run Jest tests
npm run lint           # Run ESLint
```

### Survey Editor

```bash
cd packages/fika-collect-survey-editor
npm run dev            # Start Vite dev server on http://localhost:5173
npm run build          # Build for production
npm run preview        # Preview production build
npm run serve          # Run production server
npm run lint           # Run ESLint
```

The survey editor uses `API_BASE_URL` constant that auto-detects environment:
- Development (localhost:5173): calls `http://localhost:3000/api/v1`
- Production: calls `https://app.fikadigital.org/api/v1`

### Survey Schema Package

```bash
cd packages/fika-collect-survey-schema
npm run build          # Compile TypeScript
npm test               # Run tests
npm run test:watch     # Run tests in watch mode
npm run coverage       # Generate coverage report
npm run lint           # Run ESLint
```

### Root-Level Commands

```bash
npm run build          # Build survey editor
npm run build:docs     # Generate API docs from OpenAPI spec
npx tsc                # Compile all TypeScript in api/ to dist/
```

### Running Tests

```bash
npm test --workspace=fika-collect-vercel  # Run API endpoint tests
```

## Architecture

### React Native App Architecture

**State Management:**
- Redux Toolkit with three slices: `announcements`, `localization`, `userInfo`
- Store configured in `fika-collect-app/src/data/store.ts`
- Redux Logger middleware enabled in dev mode

**Navigation:**
- Bottom tabs: Surveys, Responses, Settings
- Modal screens: Survey (for taking surveys), Consent
- Stack navigator wraps tab navigator
- Localized screen titles and tab labels

**Data Management:**
- `SurveySchemaManager` - Fetches and caches survey definitions from S3 manifest
- `SurveyResponseManager` - Handles local storage and upload of survey responses
- Uses MMKV for persistent storage
- File storage in DocumentDirectory (iOS) or ExternalDirectory (Android)

**Key Files:**
- `fika-collect-app/src/App.tsx` - Navigation structure
- `fika-collect-app/src/data/store.ts` - Redux store
- `fika-collect-app/src/data/SurveySchemaManager.tsx` - Survey fetching/caching
- `fika-collect-app/src/data/SurveyResponseManager.tsx` - Response persistence/upload
- `fika-collect-app/src/config.ts` - Environment-based API URL configuration

### API Endpoints (Vercel Functions)

All endpoints are in `api/` and route configuration is in `vercel.json`:

**Public Endpoints:**
- `GET /api/v1/healthcheck` - Health check
- `GET /api/v1/surveys?filter=published|all` - List surveys
- `POST /api/v1/presign-upload` - Get presigned S3 URL for image upload
- `POST /api/v1/submit-survey` - Submit completed survey
- `POST /api/v1/consent` - Store user consent

**Editor Endpoints (require auth):**
- `POST /api/v1/editor/surveys` - Create survey (also updates manifest)
- `GET /api/v1/editor/surveys` - List all surveys with title and published status
- `GET /api/v1/editor/surveys/:id` - Get survey by ID
- `PUT /api/v1/editor/surveys/:id` - Update survey (also updates manifest)
- `DELETE /api/v1/editor/surveys/:id` - Delete survey (also updates manifest)

### Survey Schema

Surveys are validated using Zod schemas in `packages/fika-collect-survey-schema/src/schema.ts`:

**Question Types:**
- `select`, `multiselect` - Choice questions
- `boolean` - Yes/No questions
- `short_answer`, `long_answer` - Text input
- `numeric` - Number input
- `email`, `phone` - Validated text input
- `photo` - Image capture
- `geolocation` - GPS coordinates
- `admin_location` - Administrative region selection

**Localization:**
- All text fields support i18n via `I18NTextSchema`
- Format: `{ "en": "English text", "fr": "Texte français", ... }`
- Supported locales: en, fr, sw, rw, om, so, aa, am, ti

**Publishing:**
- Surveys have a `published` boolean field (defaults to true for backward compatibility)
- Only published surveys appear in `/surveys/manifest.json` and `/api/v1/surveys` (by default)
- Use `?filter=all` query parameter to see unpublished surveys
- Survey editor can toggle published state via UI

### Survey Editor Architecture

**Components:**
- `SurveyList` - Lists all surveys with title, ID, published status, and actions
- `SurveyEditor` - Edit survey details, questions, and published state
- Uses React Router for navigation between list and editor views

**Key Features:**
- Survey ID is editable only when creating new surveys (read-only when editing)
- IDs are auto-sanitized (spaces/hyphens → underscores, lowercase)
- Published toggle controls visibility to mobile app users
- Changes auto-save to S3 via API endpoints
- Delete button confirms before deletion

### Data Flow

1. **Survey Creation/Update:** Editor → `POST/PUT /api/v1/editor/surveys/:id` → S3 bucket → `updateManifest()` helper updates `/surveys/manifest.json`
2. **App Launch:** App → Fetch `/surveys/manifest.json` or `/api/v1/surveys` → Download/cache published surveys only
3. **Taking Survey:** User completes → Save locally → Upload to S3 when online
4. **Image Upload:** Request presigned URL → Upload directly to S3

### Manifest Update Helper

Location: `api/util/updateManifest.ts`

This helper is called after every survey create/update/delete operation to maintain backward compatibility with older mobile app versions that read directly from S3:

- Reads all survey JSON files from S3
- Filters to only include surveys where `published === true`
- Writes updated manifest to `/surveys/manifest.json`
- Handles errors gracefully (logs warnings but continues processing)

### Environment Configuration

The app uses `__DEV__` flag to switch between environments:
- **Development:** `http://localhost:3000/api/v1` (requires local dev server)
- **Production:** `https://app.fikadigital.org/api/v1`

Config file: `fika-collect-app/src/config.ts`

## Important Notes

### Deployment & Infrastructure
- Vercel deploys automatically on push to main
- AWS infrastructure (Lambda/API Gateway) is deprecated due to DNS CAA record limitations preventing HTTPS
- React Native app refuses to live in npm workspaces
- Survey manifest lives at: `https://fika-collect.s3.us-west-1.amazonaws.com/surveys/manifest.json`

### Development Server
- Location: `packages/fika-collect-vercel/server.js`
- Dynamically loads and wraps Vercel functions from `api/`
- Supports CORS for local development (allows requests from localhost:5173)
- Handles multiple HTTP methods per route (GET, POST, PUT, DELETE)
- Passes route parameters (e.g., `:id`) as URL search parameters to handlers

### Route Parameters

Route parameters work identically in both development and production:
- **Vercel production**: `vercel.json` rewrites `/api/v1/editor/surveys/:id` to `api/editor-survey-actions.ts?id=$id`
- **Dev server**: Extracts Express `req.params` and adds them to URL searchParams
- **Handler code**: Always reads via `url.searchParams.get('id')`

This means you can safely use `url.searchParams.get('paramName')` in all API handlers.

### API Response Patterns

Both `/api/v1/surveys` and `/api/v1/editor/surveys` endpoints:
- Read each survey file from S3 individually (not just list metadata)
- Parse survey JSON to extract `published` status and `title`
- Filter and include published status in responses
- This approach ensures accurate published state without caching issues

### Testing

Tests are in `packages/fika-collect-vercel/test/`:
- Mock S3 client commands (`ListObjectsV2Command`, `GetObjectCommand`, `PutObjectCommand`, etc.)
- When updating endpoints to use new S3 commands, update corresponding test mocks
- Test fixtures in `test/fixtures/` must include all required schema fields (including `published`)
