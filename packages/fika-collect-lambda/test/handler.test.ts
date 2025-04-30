import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { presignUpload, submitSurvey, s3 } from "../src/handler";
import { describe, it, expect, vi, beforeEach } from "vitest";

const __dirname = dirname(fileURLToPath(import.meta.url));
const responseFixture: Record<string, unknown> = JSON.parse(
  readFileSync(join(__dirname, "fixtures", "response.json"), "utf8")
);

const mocks = vi.hoisted(() => ({
  getSignedUrl: vi.fn(),
  send: vi.fn(),
  HeadObjectCommand: vi.fn(),
  PutObjectCommand: vi.fn(),
}));

vi.mock('@aws-sdk/s3-request-presigner', () => ({
  getSignedUrl: mocks.getSignedUrl
}));

vi.mock('@aws-sdk/client-s3', () => ({
  S3Client: vi.fn().mockImplementation(() => ({ send: mocks.send })),
  HeadObjectCommand: mocks.HeadObjectCommand,
  PutObjectCommand: mocks.PutObjectCommand,
}));

describe("presignUpload", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.resetAllMocks();
  });

  it("successfully generates a signed S3 URL", async () => {
    mocks.getSignedUrl.mockResolvedValue("https://example.com");
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
    expect(mocks.getSignedUrl.mock.calls.length).toBe(1);
    expect(mocks.send.mock.calls.length).toBe(1);
  });

  it("fails if response not submitted", async () => {
    mocks.getSignedUrl.mockResolvedValue("https://example.com");
    mocks.send.mockImplementation(() => { throw { name: 'NotFound' }; });

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

  it("handles unexpected errors gracefully", async () => {
    mocks.send.mockImplementation(() => {
      throw new Error("Unexpected error");
    });

    const event = {
      body: JSON.stringify({
        survey_id: "foo",
        response_id: "bar",
        image_id: "baz",
        file_type: "image/jpeg",
      }),
    };

    const result = await presignUpload(event);
    expect(result.statusCode).toBe(500);
    expect(result.body).toBe(JSON.stringify({ error: "Internal server error" }));
  });
});

describe("submitSurvey", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.resetAllMocks();
  });

  it("successfully submits a survey to S3", async () => {
    const event = {
      body: JSON.stringify({
        response: responseFixture,
      }),
    };

    const result = await submitSurvey(event);
    expect(result.body).toBe(JSON.stringify({ success: true }));
    expect(result.statusCode).toBe(200);
  });

  it("fails with invalid survey data", async () => {
    const event = {
      body: JSON.stringify({
        invalidField: "invalidValue",
      }),
    };

    const result = await submitSurvey(event);
    expect(result.statusCode).toBe(400);
    expect(result.body).toContain("Validation error");
  });

  it("handles unexpected errors gracefully", async () => {
    mocks.send.mockImplementation(() => {
      throw new Error("Unexpected error");
    });

    const event = {
      body: JSON.stringify({
        response: responseFixture,
      }),
    };

    const result = await submitSurvey(event);
    expect(result.statusCode).toBe(500);
    expect(result.body).toBe(JSON.stringify({ error: "Internal server error" }));
  });
});