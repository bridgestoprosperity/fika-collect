import {readFileSync} from 'node:fs';
import {dirname, join} from 'node:path';
import {fileURLToPath} from 'node:url';
import test from 'tape';
import sinon from 'sinon';
import AWS from 'aws-sdk';
import {presignUpload, submitSurvey, s3} from '../handler.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const responseFixture = JSON.parse(
  readFileSync(join(__dirname, 'fixtures', 'response.json'), 'utf8'),
);

function getSignedUrlStub() {
  return sinon
    .stub(AWS.S3.prototype, 'getSignedUrlPromise')
    .resolves('https://example.com');
}

function getPutObjectStub() {
  return sinon
    .stub(s3, 'putObject')
    .returns({promise: () => Promise.resolve({key: 'foo'})});
}
function getHeadObjectStub(success = true) {
  return sinon.stub(s3, 'headObject').returns({
    promise: () => {
      if (success) {
        return Promise.resolve({key: 'foo'});
      } else {
        return Promise.reject({code: 'NotFound'});
      }
    },
  });
}

test('presignUpload', function (t) {
  t.test('successfully generates a signed S3 URL', async function (t) {
    const presignStub = getSignedUrlStub();
    const headStub = getHeadObjectStub();
    const event = {
      body: JSON.stringify({
        survey_id: 'foo',
        response_id: 'bar',
        image_id: 'baz',
        file_type: 'image/jpeg',
      }),
    };

    const result = await presignUpload(event);
    t.equal(result.body, JSON.stringify({uploadURL: 'https://example.com'}));
    t.equal(result.statusCode, 200, 'Status code should be 200');
    t.ok(headStub.calledOnce, 'S3 headObject should be called once');
    t.ok(
      presignStub.calledOnce,
      'S3 getSignedUrlPromise should be called once',
    );

    presignStub.restore();
    headStub.restore();
  });

  t.test('fails if response not submitted', async function (t) {
    const presignStub = getSignedUrlStub();
    const headStub = getHeadObjectStub(false);
    const event = {
      body: JSON.stringify({
        survey_id: 'foo',
        response_id: 'bar',
        image_id: 'baz',
        file_type: 'image/jpeg',
      }),
    };

    const result = await presignUpload(event);
    t.equal(result.statusCode, 400, 'Status code should be 400');
    t.equal(
      result.body,
      'Response at responses/foo/bar/response.json must be submitted before uploading images',
    );
    presignStub.restore();
    headStub.restore();
    t.end();
  });

  t.test('fails with invalid file type', async function (t) {
    const presignStub = getSignedUrlStub();
    const headStub = getHeadObjectStub();
    const event = {
      body: JSON.stringify({
        survey_id: 'foo',
        response_id: 'bar',
        image_id: 'baz',
        file_type: 'application/json',
      }),
    };

    const result = await presignUpload(event);
    t.equal(result.statusCode, 400, 'Status code should be 400');
    t.equal(
      result.body,
      "{\"error\":\"Validation error: Invalid enum value. Expected 'image/jpeg' | 'image/png' | 'image/heic' | 'image/webp', received 'application/json' at \\\"file_type\\\"\"}",
    );
    presignStub.restore();
    headStub.restore();
    t.end();
  });
});

test('submitSurvey', function (t) {
  t.test('successfully submits a survey to S3', async function (t) {
    const stub = getPutObjectStub();
    const event = {
      body: JSON.stringify({
        response: responseFixture,
      }),
    };

    const result = await submitSurvey(event);
    t.equal(result.body, JSON.stringify({success: true}));
    t.equal(result.statusCode, 200, 'Status code should be 200');
    t.ok(stub.calledOnce, 'S3 pubObject should be called once');

    stub.restore();
  });
});
