import test from 'tape';
import {uploadPresignerRequestSchema} from '../src/request-schema.js';
import {fromError} from 'zod-validation-error';

test('request parameter parsing', function (t) {
  t.test('a successful request', function (t) {
    const parsedRequest = uploadPresignerRequestSchema.safeParse({
      survey_id: 'foo',
      file_type: 'image/jpeg',
      response_id: 'response123',
      image_id: 'image123',
    });
    t.equal(
      parsedRequest.success,
      true,
      'Valid request should parse successfully',
    );
    t.deepEqual(
      parsedRequest.data,
      {
        survey_id: 'foo',
        file_type: 'image/jpeg',
        response_id: 'response123',
        image_id: 'image123',
      },
      'Valid request should return the same values',
    );
    t.end();
  });

  t.test('a request with missing survey_id', function (t) {
    const parsedRequest = uploadPresignerRequestSchema.safeParse({
      file_type: 'image/jpeg',
      response_id: 'response123',
      image_id: 'image123',
    });
    t.equal(
      parsedRequest.success,
      false,
      'Request without survey_id should not parse successfully',
    );
    t.deepEqual(
      fromError(parsedRequest.error).toString(),
      'Validation error: Required at "survey_id"',
      'Error message should indicate missing survey_id',
    );
    t.end();
  });

  t.test('a request with invalid file_type', function (t) {
    const parsedRequest = uploadPresignerRequestSchema.safeParse({
      survey_id: 'foo',
      file_type: 'invalid/type',
      response_id: 'response123',
      image_id: 'image123',
    });
    t.equal(
      parsedRequest.success,
      false,
      'Request with invalid file_type should not parse successfully',
    );
    t.deepEqual(
      fromError(parsedRequest.error).toString(),
      "Validation error: Invalid enum value. Expected 'image/jpeg' | 'image/png' | 'image/heic' | 'image/webp', received 'invalid/type' at \"file_type\"",
      'Error message should indicate invalid file_type',
    );
    t.end();
  });

  t.test('a request with extra parameters', function (t) {
    const parsedRequest = uploadPresignerRequestSchema.safeParse({
      survey_id: 'foo',
      file_type: 'image/jpeg',
      response_id: 'response123',
      image_id: 'image123',
      extra_param: 'extra',
    });
    t.equal(
      parsedRequest.success,
      false,
      'Request with extra parameters should not parse successfully',
    );
    t.deepEqual(
      fromError(parsedRequest.error).toString(),
      "Validation error: Unrecognized key(s) in object: 'extra_param'",
      'Error message should indicate unexpected field',
    );
    t.end();
  });

  t.test('empty request', function (t) {
    const parsedRequest = uploadPresignerRequestSchema.safeParse(null);
    t.equal(
      parsedRequest.success,
      false,
      'Empty request should not parse successfully',
    );
    t.deepEqual(
      fromError(parsedRequest.error).toString(),
      'Validation error: Expected object, received null',
      'Error message should indicate missing request',
    );
    t.end();
  });
});
