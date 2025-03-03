# Fika Collect Lambda API

> Version 1.0.0

## Path Table

| Method | Path | Description |
| --- | --- | --- |
| POST | [/generate-upload-url](#postgenerate-upload-url) | Generate a pre-signed upload URL |

## Reference Table

| Name | Path | Description |
| --- | --- | --- |

## Path Details

***

### [POST]/generate-upload-url

- Summary  
Generate a pre-signed upload URL

#### RequestBody

- application/json

```ts
{
  // The type of the file to be uploaded
  file_type: enum[image/jpeg, image/webp, image/heic, image/png]
  // The ID of the survey associated with the file
  survey_id: string
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
