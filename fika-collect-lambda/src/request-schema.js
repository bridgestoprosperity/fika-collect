import z from 'zod';

const fileTypeSchema = z.enum([
  'image/jpeg',
  'image/png',
  'image/heic',
  'image/webp',
]);

const surveySchema = z.object({
  id: z.string().nonempty(),
  title: z.string().nonempty(),
  description: z.string().nonempty(),
  questions: z.array(
    z.object({
      id: z.string().nonempty(),
      type: z.enum([
        'multiple_choice',
        'boolean',
        'short_answer',
        'long_answer',
      ]),
      question: z.string(),
      hint: z.string().optional(),
      options: z.array(z.string()).optional(),
    }),
  ),
});

const surveySubmissionRequestSchema = z
  .object({
    response: z.object({
      id: z.string(),
      survey_id: z.string().nonempty(),
      submitted_at: z.string().datetime().nonempty(),
      responses: z.array(
        z.object({
          question_id: z.string().nonempty(),
          value: z.union([z.string(), z.number(), z.boolean()]),
        }),
      ),
      schema: surveySchema,
    }),
  })
  .strict();

const uploadPresignerRequestSchema = z
  .object({
    file_type: fileTypeSchema,
    survey_id: z.string().nonempty('survey_id is required'),
    response_id: z.string().nonempty('response_id is required'),
    image_id: z.string().nonempty('image_id is required'),
  })
  .strict();

export {
  uploadPresignerRequestSchema,
  surveySubmissionRequestSchema,
  fileTypeSchema,
};
