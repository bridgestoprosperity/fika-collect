import z from 'zod';

const FileTypeSchema = z.enum([
  'image/jpeg',
  'image/png',
  'image/heic',
  'image/webp',
]);

const QuestionTypeSchema = z.enum([
  'multiselect',
  'multiple_choice',
  'boolean',
  'short_answer',
  'long_answer',
  'photo',
  'location',
]);

const SurveyQuestionSchema = z.object({
  id: z.string().nonempty(),
  type: QuestionTypeSchema,
  question: z.string(),
  hint: z.string().optional(),
  options: z.array(z.string()).optional(),
});

const SurveySchema = z.object({
  id: z.string().nonempty(),
  title: z.string().nonempty(),
  description: z.string().nonempty(),
  questions: z.array(SurveyQuestionSchema),
});

type Survey = z.infer<typeof SurveySchema>;
type SurveyQuestion = z.infer<typeof SurveyQuestionSchema>;
type FileType = z.infer<typeof FileTypeSchema>;
type QuestionType = z.infer<typeof QuestionTypeSchema>;

export type {Survey};
export type {FileType};
export type {SurveyQuestion};
export type {QuestionType};

export {FileTypeSchema, SurveySchema, SurveyQuestionSchema, QuestionTypeSchema};
