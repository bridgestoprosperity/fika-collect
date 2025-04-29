import { describe, it, expect } from 'vitest';
import { SurveySchema } from '../src/schema.js';
import { readFileSync } from 'fs';
import { join } from 'path';
const __dirname = new URL('.', import.meta.url).pathname;

const detailedReport = JSON.parse(
  readFileSync(join(__dirname, 'fixtures', 'detailed_report.json'), 'utf8')
);

describe('SurveySchema', () => {
  it('validates basic schema', () => {
    const result = SurveySchema.safeParse({
      id: 'test_schema',
      title: { 'en': "foo" },
      description: { "en": "bar" },
      questions: []
    });
    expect(result.success).toBe(true);
  });

  it('invalidates schema with invalid locale', () => {
    const result = SurveySchema.safeParse({
      id: 'test_schema',
      title: { 'qwerty': "foo" },
      description: { "qwerty": "bar" },
      questions: []
    });
    expect(result.success).toBe(false);
    expect(result.error?.issues.length).toBe(2);
  });

  it('validates schema with questions', () => {
    const result = SurveySchema.safeParse({
      id: 'test_schema',
      title: { 'en': "foo" },
      description: { "fr": "bar" },
      questions: [{
        "type": "boolean",
        "id": "question_1",
        "question": {
          "en": "This is not a schema.",
          "fr": "Ceci n'est pas un schéma.",
        },
        "hint": {
          "en": "This is a hint.",
          "fr": "Ceci est un indice.",
        },
      }, {
        "type": "multiple_choice",
        "id": "question_2",
        "question": {
          "en": "This is not a schema.",
          "fr": "Ceci n'est pas un schéma.",
        },
        "options": [
          { "en": "Option 1", "fr": "Option 1" },
          { "en": "Option 2", "fr": "Option 2" },
        ]
      }]
    });
    expect(result.success).toBe(true);
  });

  it('validates schema with old-style unwrapped strings', () => {
    const result = SurveySchema.safeParse({
      id: 'test_schema',
      title: 'foo',
      description: 'bar',
      questions: []
    });
    expect(result.success).toBe(true);
    expect(result.data).toEqual({
      id: 'test_schema',
      title: { 'en': 'foo' },
      description: { 'en': 'bar' },
      questions: []
    });
  });
});
