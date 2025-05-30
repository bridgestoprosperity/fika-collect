import { z } from 'zod';
// These are provided as a UI convenience for the editor but do not restrict
// the locales that can be used in the app.
const LOCALE_LABELS = {
    'en': 'English',
    'ar': 'Arabic',
    'zh': 'Chinese',
    'fr': 'French',
    'de': 'German',
    'it': 'Italian',
    'ja': 'Japanese',
    'rw': 'Kinyarwanda',
    'ko': 'Korean',
    'ln': 'Lingala',
    'pt': 'Portuguese',
    'ru': 'Russian',
    'es': 'Spanish',
    'sw': 'Swahili',
};
const LocaleStringSchema = z.string().min(2).max(2);
const I18NTextSchema = z.preprocess((val) => {
    if (val === null || val === undefined) {
        return { en: '' };
    }
    if (typeof val === 'string') {
        return { en: val };
    }
    return val;
}, z.record(LocaleStringSchema, z.string()));
const FileTypeSchema = z.enum([
    'image/jpeg',
    'image/png',
    'image/heic',
    'image/webp',
]);
const QuestionTypeSchema = z.preprocess(
// Apply renamings for backward-compatibility with historical choices
(val) => val === 'location' ? 'geolocation' : (val === 'multiple_choice' ? 'select' : val), z.enum([
    'multiselect',
    'select',
    'numeric',
    'boolean',
    'short_answer',
    'long_answer',
    'photo',
    'geolocation',
    'admin_location',
]));
const SurveyQuestionSchema = z.object({
    id: z.string().nonempty(),
    type: QuestionTypeSchema,
    required: z.boolean().default(true),
    question: I18NTextSchema,
    hint: I18NTextSchema,
    options: z.array(I18NTextSchema).optional(),
});
const SurveySchema = z.object({
    id: z.string().nonempty(),
    title: I18NTextSchema,
    description: I18NTextSchema,
    questions: z.array(SurveyQuestionSchema),
});
export { FileTypeSchema, SurveySchema, SurveyQuestionSchema, QuestionTypeSchema, LOCALE_LABELS, I18NTextSchema, LocaleStringSchema };
