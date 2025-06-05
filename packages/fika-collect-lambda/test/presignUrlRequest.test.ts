import { describe, it, expect } from 'vitest';
import { uploadPresignerRequestSchema } from '../src/util/requestSchema.js';
import { fromError } from 'zod-validation-error';

describe('request parameter parsing', () => {
  it('should parse a successful request', () => {
    const parsedRequest = uploadPresignerRequestSchema.safeParse({
      survey_id: 'foo',
      file_type: 'image/jpeg',
      response_id: 'response123',
      image_id: 'image123',
    });
    expect(parsedRequest.success).toBe(true);
    expect(parsedRequest.data).toEqual({
      survey_id: 'foo',
      file_type: 'image/jpeg',
      response_id: 'response123',
      image_id: 'image123',
    });
  });

  it('should fail to parse a request with missing survey_id', () => {
    const parsedRequest = uploadPresignerRequestSchema.safeParse({
      file_type: 'image/jpeg',
      response_id: 'response123',
      image_id: 'image123',
    });
    expect(parsedRequest.success).toBe(false);
    expect(fromError(parsedRequest.error).toString()).toBe(
      'Validation error: Required at "survey_id"',
    );
  });

  it('should fail to parse a request with invalid file_type', () => {
    const parsedRequest = uploadPresignerRequestSchema.safeParse({
      survey_id: 'foo',
      file_type: 'invalid/type',
      response_id: 'response123',
      image_id: 'image123',
    });
    expect(parsedRequest.success).toBe(false);
    expect(fromError(parsedRequest.error).toString()).toBe(
      "Validation error: Invalid enum value. Expected 'image/jpeg' | 'image/png' | 'image/heic' | 'image/webp', received 'invalid/type' at \"file_type\"",
    );
  });

  it('should fail to parse a request with extra parameters', () => {
    const parsedRequest = uploadPresignerRequestSchema.safeParse({
      survey_id: 'foo',
      file_type: 'image/jpeg',
      response_id: 'response123',
      image_id: 'image123',
      extra_param: 'extra',
    });
    expect(parsedRequest.success).toBe(false);
    expect(fromError(parsedRequest.error).toString()).toBe(
      "Validation error: Unrecognized key(s) in object: 'extra_param'",
    );
  });

  it('should fail to parse an empty request', () => {
    const parsedRequest = uploadPresignerRequestSchema.safeParse(null);
    expect(parsedRequest.success).toBe(false);
    expect(fromError(parsedRequest.error).toString()).toBe(
      'Validation error: Expected object, received null',
    );
  });
});
