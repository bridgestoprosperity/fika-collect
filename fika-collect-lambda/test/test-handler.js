import test from 'tape';
import sinon from 'sinon';
import AWS from 'aws-sdk';
import handler from '../handler.js';

function getS3Stub() {
  return sinon
    .stub(AWS.S3.prototype, 'getSignedUrlPromise')
    .resolves('https://example.com');
}

test('handler', function (t) {
  t.test('successfully generates a signed S3 URL', async function (t) {
    const stub = getS3Stub();
    const event = {
      body: JSON.stringify({
        survey_id: 'foo',
        file_type: 'image/jpeg',
      }),
    };

    const result = await handler(event);
    console.log(result);

    t.equal(result.body, JSON.stringify({uploadURL: 'https://example.com'}));
    t.equal(result.statusCode, 200, 'Status code should be 200');
    t.ok(stub.calledOnce, 'S3 getSignedUrlPromise should be called once');

    stub.restore();
  });

  t.test('fails with invalid file type', async function (t) {
    const stub = getS3Stub();
    const event = {
      body: JSON.stringify({
        survey_id: 'foo',
        file_type: 'application/json',
      }),
    };

    const result = await handler(event);
    t.equal(result.statusCode, 400, 'Status code should be 400');
    t.equal(
      result.body,
      "{\"error\":\"Validation error: Invalid enum value. Expected 'image/jpeg' | 'image/png' | 'image/heic' | 'image/webp', received 'application/json' at \\\"file_type\\\"\"}",
    );
    stub.restore();
    t.end();
  });
});
