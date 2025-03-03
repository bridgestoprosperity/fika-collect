import z from 'zod';

const fileTypeSchema = z.enum([
  'image/jpeg',
  'image/png',
  'image/heic',
  'image/webp',
]);

const requestSchema = z
  .object({
    file_type: fileTypeSchema,
    survey_id: z.string().nonempty('survey_id is required'),
  })
  .strict()
  .transform(({file_type: fileType, survey_id: surveyId}) => ({
    fileType,
    surveyId,
  }));

export {requestSchema, fileTypeSchema};
