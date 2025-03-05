# Fika Collect Lambda API

> Version 1.0.0

## Path Table

| Method | Path | Description |
| --- | --- | --- |
| POST | [/submit-survey](#postsubmit-survey) | Submit a survey response |
| POST | [/generate-upload-url](#postgenerate-upload-url) | Generate a pre-signed upload URL |

## Reference Table

| Name | Path | Description |
| --- | --- | --- |

## Path Details

***

### [POST]/submit-survey

- Summary  
Submit a survey response

- Description  
Puts survey response object on S3 with key `{survey_id}/{response_id}/response.json`.

#### RequestBody

- application/json

```ts
{
  // The survey response
  response: {
  }
}
```

#### Responses

- 200 Successful response

`application/json`

```ts
{
  // The pre-signed URL for file upload
  uploadURL?: string
}
```

- 400 Bad request

`application/json`

```ts
{
  // The error message
  error?: string
}
```

- 500 Internal server error

`application/json`

```ts
{
  // The error message
  error?: string
}
```

***

### [POST]/generate-upload-url

- Summary  
Generate a pre-signed upload URL

- Description  
Returns pre-signed URL for file upload to S3 under key `{survey_id}/{response_id}/{image_id}.{file_type}`. Survey response *must* be succesfully uploaded to S3 before calling this endpoint.

#### RequestBody

- application/json

```ts
{
  // The type of the file to be uploaded
  file_type: enum[image/jpeg, image/webp, image/heic, image/png]
  // The ID of the survey associated with the file
  survey_id: string
  // The ID of the survey response
  response_id: string
  // The ID of the image to be associated with the survey
  image_id: string
}
```

#### Responses

- 200 Successful response

`application/json`

```ts
{
  // The pre-signed URL for file upload
  uploadURL?: string
}
```

- 400 Bad request

`application/json`

```ts
{
  // The error message
  error?: string
}
```

- 500 Internal server error

`application/json`

```ts
{
  // The error message
  error?: string
}
```

## References
