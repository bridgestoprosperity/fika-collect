import { SurveySchema, FileTypeSchema } from 'fika-collect-survey-schema';
import z from 'zod';

const surveySubmissionRequestSchema = z
  .object({
    response: z.object({
      id: z.string(),
      user_id: z.string(),
      survey_id: z.string().nonempty(),
      submitted_at: z.string().datetime().nonempty(),
      responses: z.array(
        z.object({
          question_id: z.string().nonempty(),
          value: z.any().optional(),
          stringValue: z.string().optional(),
        }),
      ),
      schema: SurveySchema,
    }),
  })
  .strict();

const uploadPresignerRequestSchema = z
  .object({
    file_type: FileTypeSchema,
    survey_id: z.string().nonempty('survey_id is required'),
    response_id: z.string().nonempty('response_id is required'),
    image_id: z.string().nonempty('image_id is required'),
  })
  .strict();

export {
  uploadPresignerRequestSchema,
  surveySubmissionRequestSchema,
  FileTypeSchema,
  SurveySchema,
};
