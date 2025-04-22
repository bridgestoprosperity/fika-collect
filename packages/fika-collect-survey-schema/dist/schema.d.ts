import z from 'zod';
declare const LOCALE_LABELS: {
    en: string;
    es: string;
    fr: string;
    de: string;
    it: string;
    pt: string;
    ru: string;
    zh: string;
    ja: string;
    ko: string;
    ar: string;
    sw: string;
    rw: string;
    ln: string;
};
declare const FileTypeSchema: z.ZodEnum<["image/jpeg", "image/png", "image/heic", "image/webp"]>;
declare const QuestionTypeSchema: z.ZodEnum<["multiselect", "multiple_choice", "boolean", "short_answer", "long_answer", "photo", "location"]>;
declare const SurveyQuestionSchema: z.ZodObject<{
    id: z.ZodString;
    type: z.ZodEnum<["multiselect", "multiple_choice", "boolean", "short_answer", "long_answer", "photo", "location"]>;
    required: z.ZodDefault<z.ZodBoolean>;
    question: z.ZodEffects<z.ZodRecord<z.ZodString, z.ZodString>, Record<string, string>, unknown>;
    hint: z.ZodOptional<z.ZodEffects<z.ZodRecord<z.ZodString, z.ZodString>, Record<string, string>, unknown>>;
    options: z.ZodOptional<z.ZodArray<z.ZodEffects<z.ZodRecord<z.ZodString, z.ZodString>, Record<string, string>, unknown>, "many">>;
}, "strip", z.ZodTypeAny, {
    type: "boolean" | "multiselect" | "multiple_choice" | "short_answer" | "long_answer" | "photo" | "location";
    id: string;
    required: boolean;
    question: Record<string, string>;
    options?: Record<string, string>[] | undefined;
    hint?: Record<string, string> | undefined;
}, {
    type: "boolean" | "multiselect" | "multiple_choice" | "short_answer" | "long_answer" | "photo" | "location";
    id: string;
    options?: unknown[] | undefined;
    required?: boolean | undefined;
    question?: unknown;
    hint?: unknown;
}>;
declare const SurveySchema: z.ZodObject<{
    id: z.ZodString;
    title: z.ZodEffects<z.ZodRecord<z.ZodString, z.ZodString>, Record<string, string>, unknown>;
    description: z.ZodEffects<z.ZodRecord<z.ZodString, z.ZodString>, Record<string, string>, unknown>;
    questions: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        type: z.ZodEnum<["multiselect", "multiple_choice", "boolean", "short_answer", "long_answer", "photo", "location"]>;
        required: z.ZodDefault<z.ZodBoolean>;
        question: z.ZodEffects<z.ZodRecord<z.ZodString, z.ZodString>, Record<string, string>, unknown>;
        hint: z.ZodOptional<z.ZodEffects<z.ZodRecord<z.ZodString, z.ZodString>, Record<string, string>, unknown>>;
        options: z.ZodOptional<z.ZodArray<z.ZodEffects<z.ZodRecord<z.ZodString, z.ZodString>, Record<string, string>, unknown>, "many">>;
    }, "strip", z.ZodTypeAny, {
        type: "boolean" | "multiselect" | "multiple_choice" | "short_answer" | "long_answer" | "photo" | "location";
        id: string;
        required: boolean;
        question: Record<string, string>;
        options?: Record<string, string>[] | undefined;
        hint?: Record<string, string> | undefined;
    }, {
        type: "boolean" | "multiselect" | "multiple_choice" | "short_answer" | "long_answer" | "photo" | "location";
        id: string;
        options?: unknown[] | undefined;
        required?: boolean | undefined;
        question?: unknown;
        hint?: unknown;
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    id: string;
    title: Record<string, string>;
    description: Record<string, string>;
    questions: {
        type: "boolean" | "multiselect" | "multiple_choice" | "short_answer" | "long_answer" | "photo" | "location";
        id: string;
        required: boolean;
        question: Record<string, string>;
        options?: Record<string, string>[] | undefined;
        hint?: Record<string, string> | undefined;
    }[];
}, {
    id: string;
    questions: {
        type: "boolean" | "multiselect" | "multiple_choice" | "short_answer" | "long_answer" | "photo" | "location";
        id: string;
        options?: unknown[] | undefined;
        required?: boolean | undefined;
        question?: unknown;
        hint?: unknown;
    }[];
    title?: unknown;
    description?: unknown;
}>;
type Survey = z.infer<typeof SurveySchema>;
type SurveyQuestion = z.infer<typeof SurveyQuestionSchema>;
type FileType = z.infer<typeof FileTypeSchema>;
type QuestionType = z.infer<typeof QuestionTypeSchema>;
export type { Survey };
export type { FileType };
export type { SurveyQuestion };
export type { QuestionType };
export { FileTypeSchema, SurveySchema, SurveyQuestionSchema, QuestionTypeSchema, LOCALE_LABELS };
//# sourceMappingURL=schema.d.ts.map