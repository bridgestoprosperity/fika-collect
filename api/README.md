# Vercel Function Endpoints

This directory contains Vercel serverless function endpoints for the Fika Collect API. Deployment to Vercel happens automatically upon push to main.

## Overview

All endpoints are TypeScript files in this directory. Route configuration is managed in `vercel.json` at the project root. The dev server (`packages/fika-collect-vercel/server.js`) wraps these endpoints for local development.

### Route Parameters

Route parameters are passed as query string parameters in both environments:
- **Vercel production**: `vercel.json` rewrites `/api/v1/editor/surveys/:id` to `api/editor-survey-actions.ts?id=$id`
- **Dev server**: Extracts Express `req.params` and adds them to URL searchParams
- **Handler code**: Always reads via `url.searchParams.get('id')`

## Public Endpoints

These endpoints are used by the mobile app and do not require authentication.

### GET `/api/v1/healthcheck`

Health check endpoint.

**Response:**
```json
{
  "status": "ok"
}
```

### GET `/api/v1/surveys`

List surveys with optional filtering by published status.

**Query Parameters:**

| Name     | Type                   | Default       | Description                           |
| -------- | ---------------------- | ------------- | ------------------------------------- |
| `filter` | `"published" \| "all"` | `"published"` | Filter to show published or all surveys |

**Response:**
```json
{
  "surveys": [
    {
      "survey_id": "bridge_request",
      "key": "surveys/bridge_request.json",
      "updated_at": "2025-10-07T21:15:33.000Z",
      "published": true
    }
  ]
}
```

**Notes:**
- Reads each survey file from S3 to determine published status
- By default returns only published surveys
- Use `?filter=all` to see all surveys including unpublished

### POST `/api/v1/presign-upload`

Generate a presigned S3 URL for uploading survey response images.

**Request Body:**
```json
{
  "survey_id": "bridge_request",
  "response_id": "abc123",
  "question_id": "photo_question",
  "file_type": "image/jpeg"
}
```

**Response:**
```json
{
  "url": "https://s3.amazonaws.com/...",
  "key": "responses/bridge_request/abc123/photo_question.jpg"
}
```

**Notes:**
- Validates that the survey exists
- Validates that the question requires a photo
- Validates file type against allowed types
- Returns presigned URL valid for 15 minutes

### POST `/api/v1/submit-survey`

Submit a completed survey response.

**Request Body:**
```json
{
  "response": {
    "id": "response_uuid",
    "user_id": "device_user_id",
    "survey_id": "bridge_request",
    "responses": [
      {
        "question_id": "location",
        "value": { "lat": 0, "lon": 0 }
      }
    ],
    "submitted_at": "2025-10-07T21:15:33.000Z",
    "schema": { /* survey schema snapshot */ }
  }
}
```

**Response:**
```json
{
  "key": "responses/bridge_request/response_uuid/response.json"
}
```

**Notes:**
- Stores response to S3 at `responses/{survey_id}/{response_id}/response.json`
- Includes full survey schema snapshot for historical reference
- Validates response against survey schema

### POST `/api/v1/consent`

Store user consent record.

**Request Body:**

| Field          | Type     | Required | Default                    | Description                |
| -------------- | -------- | -------- | -------------------------- | -------------------------- |
| `user_id`      | `string` | Yes      | -                          | Device-assigned user ID    |
| `consent_text` | `string` | Yes      | -                          | Full text user agreed to   |
| `timestamp`    | `string` | No       | `new Date().toISOString()` | ISO timestamp of agreement |

**Response:**
```json
{
  "success": true
}
```

**Notes:**
- Stores consent to S3 at `consent/{user_id}.json`
- Timestamp defaults to current time if not provided

## Editor Endpoints

These endpoints are used by the web-based survey editor. In production, these should be protected by authentication.

### GET `/api/v1/editor/surveys`

List all surveys with detailed information.

**Response:**
```json
{
  "surveys": [
    {
      "survey_id": "bridge_request",
      "title": "Bridge Request Survey",
      "url": "https://fika-collect.s3.amazonaws.com/surveys/bridge_request.json",
      "updated_at": "2025-10-07T21:15:33.000Z",
      "published": true
    }
  ]
}
```

**Notes:**
- Reads each survey file from S3
- Includes survey title (prefers English, falls back to first available language)
- Includes published status
- Does not filter by published status (shows all surveys)

### GET `/api/v1/editor/surveys/:id`

Get a specific survey by ID.

**URL Parameters:**

| Name | Type     | Description |
| ---- | -------- | ----------- |
| `id` | `string` | Survey ID   |

**Response:**
```json
{
  "id": "bridge_request",
  "title": { "en": "Bridge Request Survey" },
  "description": { "en": "Submit a request for a new bridge" },
  "published": true,
  "questions": [
    {
      "id": "location",
      "type": "geolocation",
      "question": { "en": "Where should the bridge be built?" },
      "hint": { "en": "Tap to get your current location" },
      "required": true
    }
  ]
}
```

**Notes:**
- Returns 404 if survey not found
- Returns full survey schema

### POST `/api/v1/editor/surveys`

Create a new survey.

**Request Body:**
```json
{
  "id": "new_survey",
  "title": { "en": "New Survey" },
  "description": { "en": "Survey description" },
  "published": false,
  "questions": []
}
```

**Response:**
```json
{
  "success": true,
  "survey_id": "new_survey"
}
```

**Notes:**
- Validates survey schema with Zod
- Stores to S3 at `surveys/{survey_id}.json`
- Updates `/surveys/manifest.json` to reflect new published surveys
- Returns 400 if validation fails

### PUT `/api/v1/editor/surveys/:id`

Update an existing survey.

**URL Parameters:**

| Name | Type     | Description |
| ---- | -------- | ----------- |
| `id` | `string` | Survey ID   |

**Request Body:**
```json
{
  "id": "bridge_request",
  "title": { "en": "Updated Bridge Request Survey" },
  "description": { "en": "Updated description" },
  "published": true,
  "questions": [...]
}
```

**Response:**
```json
{
  "success": true,
  "survey_id": "bridge_request"
}
```

**Notes:**
- Validates survey schema with Zod
- Ensures ID in URL matches ID in request body
- Updates S3 at `surveys/{survey_id}.json`
- Updates `/surveys/manifest.json` to reflect published state changes
- Returns 400 if validation fails or IDs don't match

### DELETE `/api/v1/editor/surveys/:id`

Delete a survey.

**URL Parameters:**

| Name | Type     | Description |
| ---- | -------- | ----------- |
| `id` | `string` | Survey ID   |

**Response:**
```json
{
  "success": true,
  "survey_id": "bridge_request"
}
```

**Notes:**
- Deletes survey from S3 (`surveys/{survey_id}.json`)
- Updates `/surveys/manifest.json` to remove from published surveys
- Does not delete associated responses

## Manifest Update Helper

Location: `api/util/updateManifest.ts`

This helper is called automatically after survey create/update/delete operations to maintain backward compatibility with older mobile app versions that read directly from S3.

**What it does:**
1. Lists all survey files from S3
2. Reads each survey to check `published` status
3. Filters to include only `published: true` surveys
4. Writes updated manifest to `/surveys/manifest.json`

**Manifest format:**
```json
{
  "surveys": [
    {
      "survey_id": "bridge_request",
      "key": "surveys/bridge_request.json",
      "updated_at": "2025-10-07T21:15:33.000Z"
    }
  ]
}
```

**Notes:**
- Only published surveys appear in manifest
- Surveys without `published` field default to `true` (backward compatibility)
- Errors are logged but don't fail the operation

## Development

### Local Development Server

```bash
cd packages/fika-collect-vercel
npm start  # Runs on http://localhost:3000
```

Requires `env.development.json` in project root with AWS credentials.

### Testing

```bash
npm test --workspace=fika-collect-vercel
```

Tests are in `packages/fika-collect-vercel/test/`.

### Compiling TypeScript

```bash
npx tsc  # Compiles api/*.ts to dist/*.js
```

## Error Handling

All endpoints follow consistent error response format:

```json
{
  "error": "Error message",
  "details": "Optional additional details"
}
```

Common HTTP status codes:
- `200 OK` - Successful operation
- `201 Created` - Resource created successfully
- `400 Bad Request` - Invalid request data or validation failed
- `404 Not Found` - Resource not found
- `500 Internal Server Error` - Server error

## CORS

All endpoints include CORS headers:
```
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization
```

The dev server handles CORS preflight (OPTIONS) requests automatically.
