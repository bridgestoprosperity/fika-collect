import { GET as listSurveys } from '../../../../api/list-surveys.js';
import { describe, it, expect, vi, beforeEach } from "vitest";

const mocks = vi.hoisted(() => ({
  getSignedUrl: vi.fn(),
  send: vi.fn(),
  ListObjectsV2Command: vi.fn(),
  GetObjectCommand: vi.fn()
}));

vi.mock('@aws-sdk/client-s3', () => ({
  S3Client: vi.fn().mockImplementation(() => ({ send: mocks.send })),
  ListObjectsV2Command: mocks.ListObjectsV2Command,
  GetObjectCommand: mocks.GetObjectCommand,
}));

describe("listSurveys", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.resetAllMocks();
  });

  it("successfully lists surveys", async () => {

    const request = new Request("http://localhost/api/v1/surveys", {
      method: "GET",
    });

    // Track which command is being called by inspecting call count
    let callCount = 0;
    mocks.send.mockImplementation((command: any) => {
      callCount++;
      // First call: ListObjectsV2Command returns the list of survey files
      if (callCount === 1) {
        return Promise.resolve({
          $metadata: { httpStatusCode: 200 },
          Contents: [
            { Key: 'surveys/survey1.json', LastModified: new Date('2025-01-01') },
            { Key: 'surveys/survey2.json', LastModified: new Date('2025-01-02') },
            { Key: 'surveys/survey3.json', LastModified: new Date('2025-01-03') }
          ]
        });
      }
      // Subsequent calls: GetObjectCommand returns the survey content
      // Determine which survey based on call count
      const surveyIndex = callCount - 2; // 0, 1, 2
      const surveyId = `survey${surveyIndex + 1}`;
      const surveyContent = {
        id: surveyId,
        title: { en: `Survey ${surveyId}` },
        description: { en: `Description for ${surveyId}` },
        published: true,
        questions: []
      };
      return Promise.resolve({
        Body: {
          transformToString: () => Promise.resolve(JSON.stringify(surveyContent))
        }
      });
    });

    const response = await listSurveys(request);
    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body).toEqual({
      "surveys": [
        {
          "key": "surveys/survey1.json",
          "updated_at": new Date('2025-01-01').toISOString(),
          "survey_id": 'survey1',
          "published": true
        },
        {
          "key": "surveys/survey2.json",
          "updated_at": new Date('2025-01-02').toISOString(),
          "survey_id": 'survey2',
          "published": true
        },
        {
          "key": "surveys/survey3.json",
          "updated_at": new Date('2025-01-03').toISOString(),
          "survey_id": 'survey3',
          "published": true
        },
      ]
    });

    // Should call send 4 times: 1 for ListObjects, 3 for GetObject
    expect(mocks.send).toHaveBeenCalledTimes(4);
    expect(mocks.ListObjectsV2Command).toHaveBeenCalledWith({
      // The bucket is undefined for awful reasons, because the config is not correctly
      // loaded in the test environment. Fortunately, it doesn't matter.
      Bucket: undefined,
      Prefix: `surveys/`,
    });
  });
});
