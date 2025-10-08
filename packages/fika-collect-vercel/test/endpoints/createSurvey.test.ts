import { POST as createSurvey } from '../../../../api/editor-survey-collection-actions.js';
import { describe, it, expect, vi, beforeEach } from "vitest";

const mocks = vi.hoisted(() => ({
  send: vi.fn(),
  GetObjectCommand: vi.fn(),
  PutObjectCommand: vi.fn(),
  ListObjectsV2Command: vi.fn(),
}));

vi.mock('@aws-sdk/client-s3', () => ({
  S3Client: vi.fn().mockImplementation(() => ({ send: mocks.send })),
  GetObjectCommand: mocks.GetObjectCommand,
  PutObjectCommand: mocks.PutObjectCommand,
  ListObjectsV2Command: mocks.ListObjectsV2Command,
}));

vi.mock('../../../../api/util/updateManifest.js', () => ({
  updateManifest: vi.fn().mockResolvedValue(undefined),
}));

describe("createSurvey", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.resetAllMocks();
  });

  it("successfully creates a new survey", async () => {
    const newSurvey = {
      id: "new_survey",
      title: { en: "New Survey" },
      description: { en: "A new survey" },
      published: false,
      questions: []
    };

    // Track call count to differentiate between GetObject and PutObject
    let callCount = 0;
    mocks.send.mockImplementation((command: any) => {
      callCount++;
      // First call: GetObjectCommand should throw NoSuchKey
      if (callCount === 1) {
        const error: any = new Error('The specified key does not exist.');
        error.name = 'NoSuchKey';
        throw error;
      }
      // Second call: PutObjectCommand succeeds
      return Promise.resolve({});
    });

    const request = new Request("http://localhost/api/v1/editor/surveys", {
      method: "POST",
      body: JSON.stringify(newSurvey),
      headers: { "Content-Type": "application/json" },
    });

    const response = await createSurvey(request);
    expect(response.status).toBe(201);
    const body = await response.json();
    expect(body).toEqual({
      success: true,
      survey_id: "new_survey"
    });

    // Should call send twice: once for GetObject (check existence), once for PutObject
    expect(mocks.send).toHaveBeenCalledTimes(2);
    expect(mocks.GetObjectCommand).toHaveBeenCalledWith({
      Bucket: 'INVALID',
      Key: 'surveys/new_survey.json',
    });
    expect(mocks.PutObjectCommand).toHaveBeenCalledWith(
      expect.objectContaining({
        Bucket: 'INVALID',
        Key: 'surveys/new_survey.json',
        ContentType: 'application/json',
      })
    );
  });

  it("fails when survey already exists", async () => {
    const existingSurvey = {
      id: "existing_survey",
      title: { en: "Existing Survey" },
      description: { en: "An existing survey" },
      published: true,
      questions: []
    };

    // Mock GetObjectCommand to return existing survey (survey exists)
    mocks.send.mockImplementation(() => {
      return Promise.resolve({
        Body: {
          transformToString: () => Promise.resolve(JSON.stringify(existingSurvey))
        }
      });
    });

    const request = new Request("http://localhost/api/v1/editor/surveys", {
      method: "POST",
      body: JSON.stringify(existingSurvey),
      headers: { "Content-Type": "application/json" },
    });

    const response = await createSurvey(request);
    expect(response.status).toBe(409);
    const body = await response.json();
    expect(body.error).toBe("Survey already exists");
    expect(body.details).toContain("existing_survey");

    // Should only call GetObject, not PutObject
    expect(mocks.send).toHaveBeenCalledTimes(1);
    expect(mocks.GetObjectCommand).toHaveBeenCalledWith({
      Bucket: 'INVALID',
      Key: 'surveys/existing_survey.json',
    });
    expect(mocks.PutObjectCommand).not.toHaveBeenCalled();
  });

  it("fails with invalid survey data", async () => {
    const invalidSurvey = {
      // Missing required fields like id, title, description
      invalidField: "invalidValue",
    };

    const request = new Request("http://localhost/api/v1/editor/surveys", {
      method: "POST",
      body: JSON.stringify(invalidSurvey),
      headers: { "Content-Type": "application/json" },
    });

    const response = await createSurvey(request);
    expect(response.status).toBe(400);
    const body = await response.json();
    expect(body.error).toBe("Invalid survey data");
    expect(body.details).toBeDefined();

    // Should not call any S3 commands
    expect(mocks.send).not.toHaveBeenCalled();
  });

  /*
  it("handles unexpected errors gracefully", async () => {
    const newSurvey = {
      id: "error_survey",
      title: { en: "Error Survey" },
      description: { en: "A survey that causes an error" },
      published: false,
      questions: []
    };

    // Mock to throw an unexpected error
    mocks.send.mockImplementation(() => {
      throw new Error("Unexpected S3 error");
    });

    const request = new Request("http://localhost/api/v1/editor/surveys", {
      method: "POST",
      body: JSON.stringify(newSurvey),
      headers: { "Content-Type": "application/json" },
    });

    const response = await createSurvey(request);
    expect(response.status).toBe(500);
    const body = await response.json();
    expect(body.error).toBe("Failed to create survey");
  });
  */

  it("creates survey with required fields only", async () => {
    const minimalSurvey = {
      id: "minimal_survey",
      title: { en: "Minimal Survey" },
      description: { en: "Minimal description" },
      questions: []
      // published field is optional, defaults to true
    };

    let callCount = 0;
    mocks.send.mockImplementation(() => {
      callCount++;
      // First call: GetObjectCommand should throw NoSuchKey
      if (callCount === 1) {
        const error: any = new Error('The specified key does not exist.');
        error.name = 'NoSuchKey';
        throw error;
      }
      // Second call: PutObjectCommand succeeds
      return Promise.resolve({});
    });

    const request = new Request("http://localhost/api/v1/editor/surveys", {
      method: "POST",
      body: JSON.stringify(minimalSurvey),
      headers: { "Content-Type": "application/json" },
    });

    const response = await createSurvey(request);
    expect(response.status).toBe(201);
    const body = await response.json();
    expect(body).toEqual({
      success: true,
      survey_id: "minimal_survey"
    });
  });
});
