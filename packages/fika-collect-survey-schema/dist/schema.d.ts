import { z } from 'zod';
declare const LOCALE_LABELS: Record<string, string>;
declare const ENGLISH_LOCALE_LABELS: Record<string, string>;
declare const LocaleStringSchema: z.ZodString;
declare const I18NTextSchema: z.ZodEffects<z.ZodRecord<z.ZodString, z.ZodString>, Record<string, string>, unknown>;
declare const FileTypeSchema: z.ZodEnum<["image/jpeg", "image/png", "image/heic", "image/webp"]>;
declare const QuestionTypeSchema: z.ZodEffects<z.ZodEnum<["multiselect", "select", "boolean", "short_answer", "long_answer", "photo", "geolocation", "admin_location"]>, "boolean" | "multiselect" | "select" | "short_answer" | "long_answer" | "photo" | "geolocation" | "admin_location", unknown>;
declare const SurveyQuestionSchema: z.ZodEffects<z.ZodObject<{
    id: z.ZodString;
    type: z.ZodEffects<z.ZodEnum<["multiselect", "select", "boolean", "short_answer", "long_answer", "photo", "geolocation", "admin_location"]>, "boolean" | "multiselect" | "select" | "short_answer" | "long_answer" | "photo" | "geolocation" | "admin_location", unknown>;
    required: z.ZodDefault<z.ZodBoolean>;
    textInputMode: z.ZodOptional<z.ZodEnum<["numeric", "decimal", "text", "tel", "email"]>>;
    question: z.ZodEffects<z.ZodRecord<z.ZodString, z.ZodString>, Record<string, string>, unknown>;
    hint: z.ZodEffects<z.ZodRecord<z.ZodString, z.ZodString>, Record<string, string>, unknown>;
    options: z.ZodOptional<z.ZodArray<z.ZodEffects<z.ZodRecord<z.ZodString, z.ZodString>, Record<string, string>, unknown>, "many">>;
}, "strip", z.ZodTypeAny, {
    type: "boolean" | "multiselect" | "select" | "short_answer" | "long_answer" | "photo" | "geolocation" | "admin_location";
    id: string;
    required: boolean;
    question: Record<string, string>;
    hint: Record<string, string>;
    options?: Record<string, string>[] | undefined;
    textInputMode?: "email" | "numeric" | "decimal" | "text" | "tel" | undefined;
}, {
    id: string;
    options?: unknown[] | undefined;
    type?: unknown;
    required?: boolean | undefined;
    textInputMode?: "email" | "numeric" | "decimal" | "text" | "tel" | undefined;
    question?: unknown;
    hint?: unknown;
}>, {
    type: "boolean" | "multiselect" | "select" | "short_answer" | "long_answer" | "photo" | "geolocation" | "admin_location";
    id: string;
    required: boolean;
    question: Record<string, string>;
    hint: Record<string, string>;
    options?: Record<string, string>[] | undefined;
    textInputMode?: "email" | "numeric" | "decimal" | "text" | "tel" | undefined;
}, unknown>;
declare const SurveySchema: z.ZodObject<{
    id: z.ZodString;
    title: z.ZodEffects<z.ZodRecord<z.ZodString, z.ZodString>, Record<string, string>, unknown>;
    description: z.ZodEffects<z.ZodRecord<z.ZodString, z.ZodString>, Record<string, string>, unknown>;
    questions: z.ZodArray<z.ZodEffects<z.ZodObject<{
        id: z.ZodString;
        type: z.ZodEffects<z.ZodEnum<["multiselect", "select", "boolean", "short_answer", "long_answer", "photo", "geolocation", "admin_location"]>, "boolean" | "multiselect" | "select" | "short_answer" | "long_answer" | "photo" | "geolocation" | "admin_location", unknown>;
        required: z.ZodDefault<z.ZodBoolean>;
        textInputMode: z.ZodOptional<z.ZodEnum<["numeric", "decimal", "text", "tel", "email"]>>;
        question: z.ZodEffects<z.ZodRecord<z.ZodString, z.ZodString>, Record<string, string>, unknown>;
        hint: z.ZodEffects<z.ZodRecord<z.ZodString, z.ZodString>, Record<string, string>, unknown>;
        options: z.ZodOptional<z.ZodArray<z.ZodEffects<z.ZodRecord<z.ZodString, z.ZodString>, Record<string, string>, unknown>, "many">>;
    }, "strip", z.ZodTypeAny, {
        type: "boolean" | "multiselect" | "select" | "short_answer" | "long_answer" | "photo" | "geolocation" | "admin_location";
        id: string;
        required: boolean;
        question: Record<string, string>;
        hint: Record<string, string>;
        options?: Record<string, string>[] | undefined;
        textInputMode?: "email" | "numeric" | "decimal" | "text" | "tel" | undefined;
    }, {
        id: string;
        options?: unknown[] | undefined;
        type?: unknown;
        required?: boolean | undefined;
        textInputMode?: "email" | "numeric" | "decimal" | "text" | "tel" | undefined;
        question?: unknown;
        hint?: unknown;
    }>, {
        type: "boolean" | "multiselect" | "select" | "short_answer" | "long_answer" | "photo" | "geolocation" | "admin_location";
        id: string;
        required: boolean;
        question: Record<string, string>;
        hint: Record<string, string>;
        options?: Record<string, string>[] | undefined;
        textInputMode?: "email" | "numeric" | "decimal" | "text" | "tel" | undefined;
    }, unknown>, "many">;
}, "strip", z.ZodTypeAny, {
    id: string;
    title: Record<string, string>;
    description: Record<string, string>;
    questions: {
        type: "boolean" | "multiselect" | "select" | "short_answer" | "long_answer" | "photo" | "geolocation" | "admin_location";
        id: string;
        required: boolean;
        question: Record<string, string>;
        hint: Record<string, string>;
        options?: Record<string, string>[] | undefined;
        textInputMode?: "email" | "numeric" | "decimal" | "text" | "tel" | undefined;
    }[];
}, {
    id: string;
    questions: unknown[];
    title?: unknown;
    description?: unknown;
}>;
type Survey = z.infer<typeof SurveySchema>;
type SurveyQuestion = z.infer<typeof SurveyQuestionSchema>;
type FileType = z.infer<typeof FileTypeSchema>;
type QuestionType = z.infer<typeof QuestionTypeSchema>;
type I18NText = z.infer<typeof I18NTextSchema>;
type LocaleString = z.infer<typeof LocaleStringSchema>;
export type { Survey };
export type { FileType };
export type { SurveyQuestion };
export type { QuestionType };
export type { I18NText };
export type { LocaleString };
export { FileTypeSchema, SurveySchema, SurveyQuestionSchema, QuestionTypeSchema, LOCALE_LABELS, ENGLISH_LOCALE_LABELS, I18NTextSchema, LocaleStringSchema };
//# sourceMappingURL=schema.d.ts.map