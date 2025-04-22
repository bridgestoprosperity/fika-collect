import z from 'zod';
const SUPPORTED_LOCALES = [
    'en',
    'es',
    'fr',
    'de',
    'it',
    'pt',
    'ru',
    'zh',
    'ja',
    'ko',
    'ar',
    'sw',
    'rw',
    'ln', // Lingala
];
const LocaleEnum = z.enum(SUPPORTED_LOCALES);
const I18NText = z.record(LocaleEnum, z.string());
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
    required: z.boolean().default(true),
    question: I18NText,
    hint: I18NText.optional(),
    options: z.array(I18NText).optional(),
});
const SurveySchema = z.object({
    id: z.string().nonempty(),
    title: I18NText,
    description: I18NText,
    questions: z.array(SurveyQuestionSchema),
});
export { FileTypeSchema, SurveySchema, SurveyQuestionSchema, QuestionTypeSchema };
