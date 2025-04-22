import test from 'tape';
import { SurveySchema } from '../src/schema.js';
import { readFileSync } from 'fs';
import { join } from 'path';
const __dirname = new URL('.', import.meta.url).pathname;

const detailedReport = JSON.parse(
  readFileSync(join(__dirname, 'fixtures', 'detailed_report.json'), 'utf8')
);


test('schema', function (t) {
  t.test('basic schema', function (t) {
    const result = SurveySchema.safeParse({
      id: 'test_schema',
      title: { 'en': "foo", },
      description: { "en": "bar", },
      questions: []
    });
    t.ok(result.success, 'schema is valid');
    t.end();
  });

  t.test('schema with invalid local', function (t) {
    const result = SurveySchema.safeParse({
      id: 'test_schema',
      title: { 'qwerty': "foo", },
      description: { "qwerty": "bar", },
      questions: []
    });
    t.notOk(result.success, 'schema is invalid');
    t.equal(result.error?.issues.length, 2, 'schema has 2 issues');
    t.end();
  });

  t.test('schema with questions', function (t) {
    const result = SurveySchema.safeParse({
      id: 'test_schema',
      title: { 'en': "foo", },
      description: { "fr": "bar", },
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
          { "en": "Option 1", "fr": "Option 1", },
          { "en": "Option 2", "fr": "Option 2", },
        ]
      }]
    });
    t.ok(result.success, 'schema is valid');
    t.end();
  });

  t.test('schema with old-style unwrapped strings', function (t) {
    const result = SurveySchema.safeParse({
      id: 'test_schema',
      title: 'foo',
      description: 'bar',
      questions: []
    });
    t.ok(result.success, 'schema is valid');
    t.deepEqual(result.data, {
      id: 'test_schema',
      title: { 'en': 'foo' },
      description: { 'en': 'bar' },
      questions: []
    }, 'schema is valid and unwrapped strings are converted to wrapped strings');
    t.end();
  });

});