import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { POST as postConsent } from '../../../api/consent.js';
import { describe, it, expect, vi, beforeEach } from "vitest";

const __dirname = dirname(fileURLToPath(import.meta.url));
const responseFixture: Record<string, unknown> = JSON.parse(
  readFileSync(join(__dirname, "..", "fixtures", "response.json"), "utf8")
);

const mocks = vi.hoisted(() => ({
  getSignedUrl: vi.fn(),
  send: vi.fn(),
  HeadObjectCommand: vi.fn(),
  PutObjectCommand: vi.fn(),
}));

vi.mock('@aws-sdk/client-s3', () => ({
  S3Client: vi.fn().mockImplementation(() => ({ send: mocks.send })),
  HeadObjectCommand: mocks.HeadObjectCommand,
  PutObjectCommand: mocks.PutObjectCommand,
}));

describe("consent", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.resetAllMocks();
  });

  it("successfully submits consent to S3", async () => {

    const request = new Request("http://localhost/api/v1/consent", {
      method: "POST",
      body: JSON.stringify({
        user_id: "abcd1234",
        consent_text: "I agree to the terms.",
        timestamp: "2024-06-01T12:00:00.000Z"
      }),
      headers: { "Content-Type": "application/json" },
    });

    // Mock S3 send to resolve with a successful response
    mocks.send.mockResolvedValue({
      $metadata: { httpStatusCode: 200 }
    });

    const response = await postConsent(request);
    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body).toEqual({ success: true });

    expect(mocks.send).toHaveBeenCalledTimes(1);
    expect(mocks.PutObjectCommand).toHaveBeenCalledWith({
      Bucket: process.env.S3_BUCKET || 'fika-collect',
      Key: `consent/abcd1234.json`,
      Body: JSON.stringify({
        user_id: "abcd1234",
        consent_text: "I agree to the terms.",
        timestamp: "2024-06-01T12:00:00.000Z"
      })
    });
  });
});