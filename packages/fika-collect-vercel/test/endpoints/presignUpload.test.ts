import { POST as presignUpload } from '../../../../api/presign-upload.js';
import { describe, it, expect, vi, beforeEach } from "vitest";

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

    const request = new Request("http://localhost/api/v1/presign-upload", {
      method: "POST",
      body: JSON.stringify({
        survey_id: "foo",
        response_id: "bar",
        image_id: "baz",
        file_type: "image/jpeg",
      }),
      headers: { "Content-Type": "application/json" },
    });

    const result = await presignUpload(request);
    expect(result.status).toBe(200);
    expect(await result.json()).toEqual({ uploadURL: "https://example.com" });
    expect(mocks.getSignedUrl.mock.calls.length).toBe(1);
    expect(mocks.send.mock.calls.length).toBe(1);
  });

  it("fails if response not submitted", async () => {
    mocks.getSignedUrl.mockResolvedValue("https://example.com");
    mocks.send.mockImplementation(() => { throw { name: 'NotFound' }; });

    const request = new Request("http://localhost/api/v1/presign-upload", {
      method: "POST",
      body: JSON.stringify({
        survey_id: "foo",
        response_id: "bar",
        image_id: "baz",
        file_type: "image/jpeg",
      }),
      headers: { "Content-Type": "application/json" },
    });

    const result = await presignUpload(request);
    expect(result.status).toBe(400);
    const body = await result.json();
    expect(body.error).toBe(
      "Response at responses/foo/bar/response.json must be submitted before uploading images"
    );
  });

  it("fails with invalid file type", async () => {
    const request = new Request("http://localhost/api/v1/presign-upload", {
      method: "POST",
      body: JSON.stringify({
        survey_id: "foo",
        response_id: "bar",
        image_id: "baz",
        file_type: "application/json",
      }),
      headers: { "Content-Type": "application/json" },
    });

    const result = await presignUpload(request);
    expect(result.status).toBe(400);
    const body = await result.json();
    expect(body.error).toContain("Invalid enum value");
    expect(body.error).toContain("file_type");
  });

  it("returns HTTP 500 for internal errors", async () => {
    mocks.send.mockImplementation(() => {
      throw new Error("Unexpected error");
    });
    const request = new Request('http://localhost/api/v1/presign-upload', {
      method: "POST",
      body: JSON.stringify({
        survey_id: "foo",
        response_id: "bar",
        image_id: "baz",
        file_type: "image/jpeg",
      }),
      headers: { "Content-Type": "application/json" },
    });

    const result = await presignUpload(request);
    expect(result.status).toBe(500);
    expect(await result.json()).toEqual({ error: "Internal server error" });
  });
});
