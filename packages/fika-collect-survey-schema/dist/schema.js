import z from 'zod';
// These are provided as a UI convenience for the editor but do not restrict
// the locales that can be used in the app.
const LOCALE_LABELS = {
    'en': 'English',
    'es': 'Spanish',
    'fr': 'French',
    'de': 'German',
    'it': 'Italian',
    'pt': 'Portuguese',
    'ru': 'Russian',
    'zh': 'Chinese',
    'ja': 'Japanese',
    'ko': 'Korean',
    'ar': 'Arabic',
    'sw': 'Swahili',
    'rw': 'Kinyarwanda',
    'ln': 'Lingala',
};
const LocaleString = z.string().min(2).max(2);
const I18NText = z.preprocess((val) => {
    if (typeof val === 'string') {
        return { en: val };
    }
    return val;
}, z.record(LocaleString, z.string()));
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
export { FileTypeSchema, SurveySchema, SurveyQuestionSchema, QuestionTypeSchema, LOCALE_LABELS };
