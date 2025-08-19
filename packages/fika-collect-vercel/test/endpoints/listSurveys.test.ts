import { GET as listSurveys } from '../../../../api/list-surveys.js';
import { describe, it, expect, vi, beforeEach } from "vitest";

const mocks = vi.hoisted(() => ({
  getSignedUrl: vi.fn(),
  send: vi.fn(),
  ListObjectsV2Command: vi.fn()
}));

vi.mock('@aws-sdk/client-s3', () => ({
  S3Client: vi.fn().mockImplementation(() => ({ send: mocks.send })),
  ListObjectsV2Command: mocks.ListObjectsV2Command,
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

    // Mock S3 send to resolve with a successful response and realistic S3 Contents
    mocks.send.mockResolvedValue({
      $metadata: { httpStatusCode: 200 },
      Contents: [
        { Key: 'surveys/survey1.json' },
        { Key: 'surveys/survey2.json' },
        { Key: 'surveys/survey3.json' }
      ]
    });

    const response = await listSurveys(request);
    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body).toEqual([
      { "key": "surveys/survey1.json", lastModified: undefined, size: undefined },
      { "key": "surveys/survey2.json", lastModified: undefined, size: undefined },
      { "key": "surveys/survey3.json", lastModified: undefined, size: undefined },
    ]);

    expect(mocks.send).toHaveBeenCalledTimes(1);
    expect(mocks.ListObjectsV2Command).toHaveBeenCalledWith({
      Bucket: process.env.S3_BUCKET || 'fika-collect',
      Prefix: `surveys/`,
    });
  });
});
