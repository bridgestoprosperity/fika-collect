import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, it, expect } from 'vitest';
import { surveySubmissionRequestSchema } from '../../../api/util/requestSchema.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const responseFixture = JSON.parse(
  readFileSync(join(__dirname, '..', 'fixtures', 'response.json'), 'utf8'),
);

describe('request parameter parsing', () => {
  it('should parse a successful request', () => {
    const request = { response: responseFixture };

    const parsedRequest = surveySubmissionRequestSchema.safeParse(request);

    expect(parsedRequest.success).toBe(true);
    expect(parsedRequest.data).toEqual(request);
  });
});
