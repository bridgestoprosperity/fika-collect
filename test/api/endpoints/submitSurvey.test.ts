import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { POST as submitSurvey } from '../../../api/submit-survey.js';
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

describe("submitSurvey", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.resetAllMocks();
  });

  it("successfully submits a survey to S3", async () => {
    const request = new Request("http://localhost/api/v1/submit-survey", {
      method: "POST",
      body: JSON.stringify({
        response: responseFixture,
      }),
      headers: { "Content-Type": "application/json" },
    });

    const response = await submitSurvey(request);
    expect(await response.json()).toEqual({ success: true });
    expect(response.status).toBe(200);
  });

  it("fails with invalid survey data", async () => {
    const request = new Request("http://localhost/api/v1/submit-survey", {
      method: "POST",
      body: JSON.stringify({
        invalidField: "invalidValue",
      }),
      headers: { "Content-Type": "application/json" },
    });

    const response = await submitSurvey(request);
    expect(response.status).toBe(400);
    expect(await response.text()).toContain("Validation error");
  });

  it("handles unexpected errors gracefully", async () => {
    mocks.send.mockImplementation(() => {
      throw new Error("Unexpected error");
    });

    const request = new Request("http://localhost/api/v1/submit-survey", {
      method: "POST",
      body: JSON.stringify({
        response: responseFixture,
      }),
      headers: { "Content-Type": "application/json" },
    });

    const response = await submitSurvey(request);
    expect(response.status).toBe(500);
    expect(await response.json()).toEqual({ error: "Internal server error" });
  });
});