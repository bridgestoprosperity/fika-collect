import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import AWS from "aws-sdk";
import { presignUpload, submitSurvey, s3 } from "../src/handler";
import { describe, it, expect, vi, afterEach } from "vitest";

const __dirname = dirname(fileURLToPath(import.meta.url));
const responseFixture: Record<string, unknown> = JSON.parse(
  readFileSync(join(__dirname, "fixtures", "response.json"), "utf8")
);

function getSignedUrlStub() {
  return vi.spyOn(AWS.S3.prototype, "getSignedUrlPromise").mockResolvedValue(
    "https://example.com"
  );
}

function getPutObjectStub() {
  return vi.spyOn(s3, "putObject").mockImplementation(() => {
    const request = {
      promise: () =>
        Promise.resolve({
          key: "foo",
          $response: {
            httpResponse: {},
          } as AWS.Response<AWS.S3.PutObjectOutput, AWS.AWSError>,
        }),
    } as unknown as AWS.Request<AWS.S3.PutObjectOutput, AWS.AWSError>;
    return request;
  });
}

function getHeadObjectStub(success = true) {
  return vi.spyOn(s3, "headObject").mockReturnValue({
    promise: () =>
      success
        ? Promise.resolve({
          ContentLength: 1234,
          $response: {
            httpResponse: {},
          } as AWS.Response<AWS.S3.HeadObjectOutput, AWS.AWSError>,
        })
        : Promise.reject(
          Object.assign(new Error("Not Found"), { code: "NotFound" })
        ),
  });
}

describe("presignUpload", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("successfully generates a signed S3 URL", async () => {
    const presignStub = getSignedUrlStub();
    const headStub = getHeadObjectStub();
    const event = {
      body: JSON.stringify({
        survey_id: "foo",
        response_id: "bar",
        image_id: "baz",
        file_type: "image/jpeg",
      }),
    };

    const result = await presignUpload(event);
    expect(result.body).toBe(JSON.stringify({ uploadURL: "https://example.com" }));
    expect(result.statusCode).toBe(200);
    expect(vi.mocked(headStub).mock.calls.length).toBe(1);
    expect(presignStub.mock.calls.length).toBe(1);
  });

  it("fails if response not submitted", async () => {
    const presignStub = getSignedUrlStub();
    const headStub = getHeadObjectStub(false);
    const event = {
      body: JSON.stringify({
        survey_id: "foo",
        response_id: "bar",
        image_id: "baz",
        file_type: "image/jpeg",
      }),
    };

    const result = await presignUpload(event);
    expect(result.statusCode).toBe(400);
    expect(result.body).toBe(
      "Response at responses/foo/bar/response.json must be submitted before uploading images"
    );
  });

  it("fails with invalid file type", async () => {
    const presignStub = getSignedUrlStub();
    const headStub = getHeadObjectStub();
    const event = {
      body: JSON.stringify({
        survey_id: "foo",
        response_id: "bar",
        image_id: "baz",
        file_type: "application/json",
      }),
    };

    const result = await presignUpload(event);
    expect(result.statusCode).toBe(400);
    expect(result.body).toBe(
      "{\"error\":\"Validation error: Invalid enum value. Expected 'image/jpeg' | 'image/png' | 'image/heic' | 'image/webp', received 'application/json' at \\\"file_type\\\"\"}"
    );
  });
});

describe("submitSurvey", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("successfully submits a survey to S3", async () => {
    const putObjectStub = getPutObjectStub();
    const event = {
      body: JSON.stringify({
        response: responseFixture,
      }),
    };

    const result = await submitSurvey(event);
    expect(result.body).toBe(JSON.stringify({ success: true }));
    expect(result.statusCode).toBe(200);
    expect(putObjectStub.mock.calls.length).toBe(1);
  });
});
