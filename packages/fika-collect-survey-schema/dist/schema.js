import { z } from 'zod';
// These are provided as a UI convenience for the editor but do not restrict
// the locales that can be used in the app.
const LOCALE_LABELS = {
    'en': 'English',
    'fr': 'Français',
    'sw': 'Kiswahili',
    'rw': 'Kinyarwanda',
    'om': 'Afaan Oromoo',
    'so': 'Soomaali',
    'aa': 'Qafar af',
    'am': 'አማርኛ',
    'ti': 'ትግርኛ',
};
const ENGLISH_LOCALE_LABELS = {
    'en': 'English',
    'fr': 'French',
    'sw': 'Swahili',
    'rw': 'Kinyarwanda',
    'om': 'Oromo',
    'so': 'Somali',
    'aa': 'Afar',
    'am': 'Amharic',
    'ti': 'Tigrinya',
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
    'boolean',
    'short_answer',
    'long_answer',
    'photo',
    'geolocation',
    'admin_location',
    'numeric'
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
export { FileTypeSchema, SurveySchema, SurveyQuestionSchema, QuestionTypeSchema, LOCALE_LABELS, ENGLISH_LOCALE_LABELS, I18NTextSchema, LocaleStringSchema };
