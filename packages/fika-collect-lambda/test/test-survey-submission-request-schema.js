import {readFileSync} from 'node:fs';
import {dirname, join} from 'node:path';
import {fileURLToPath} from 'node:url';
import test from 'tape';
import {surveySubmissionRequestSchema} from '../src/request-schema.js';
import {fromError} from 'zod-validation-error';

const __dirname = dirname(fileURLToPath(import.meta.url));
const responseFixture = JSON.parse(
  readFileSync(join(__dirname, 'fixtures', 'response.json'), 'utf8'),
);

test('request parameter parsing', function (t) {
  t.test('a successful request', function (t) {
    const request = {response: responseFixture};

    const parsedRequest = surveySubmissionRequestSchema.safeParse(request);

    t.equal(
      parsedRequest.success,
      true,
      'Valid request should parse successfully',
    );

    t.deepEqual(
      parsedRequest.data,
      request,
      'Valid request should return the same values',
    );
    t.end();
  });
});
