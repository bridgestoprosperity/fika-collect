import z from 'zod';
declare const FileTypeSchema: z.ZodEnum<["image/jpeg", "image/png", "image/heic", "image/webp"]>;
declare const QuestionTypeSchema: z.ZodEnum<["multiselect", "multiple_choice", "boolean", "short_answer", "long_answer", "photo", "location"]>;
declare const SurveyQuestionSchema: z.ZodObject<{
    id: z.ZodString;
    type: z.ZodEnum<["multiselect", "multiple_choice", "boolean", "short_answer", "long_answer", "photo", "location"]>;
    required: z.ZodDefault<z.ZodBoolean>;
    question: z.ZodString;
    hint: z.ZodOptional<z.ZodString>;
    options: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
}, "strip", z.ZodTypeAny, {
    id: string;
    type: "boolean" | "multiselect" | "multiple_choice" | "short_answer" | "long_answer" | "photo" | "location";
    required: boolean;
    question: string;
    hint?: string | undefined;
    options?: string[] | undefined;
}, {
    id: string;
    type: "boolean" | "multiselect" | "multiple_choice" | "short_answer" | "long_answer" | "photo" | "location";
    question: string;
    required?: boolean | undefined;
    hint?: string | undefined;
    options?: string[] | undefined;
}>;
declare const SurveySchema: z.ZodObject<{
    id: z.ZodString;
    title: z.ZodString;
    description: z.ZodString;
    questions: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        type: z.ZodEnum<["multiselect", "multiple_choice", "boolean", "short_answer", "long_answer", "photo", "location"]>;
        required: z.ZodDefault<z.ZodBoolean>;
        question: z.ZodString;
        hint: z.ZodOptional<z.ZodString>;
        options: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    }, "strip", z.ZodTypeAny, {
        id: string;
        type: "boolean" | "multiselect" | "multiple_choice" | "short_answer" | "long_answer" | "photo" | "location";
        required: boolean;
        question: string;
        hint?: string | undefined;
        options?: string[] | undefined;
    }, {
        id: string;
        type: "boolean" | "multiselect" | "multiple_choice" | "short_answer" | "long_answer" | "photo" | "location";
        question: string;
        required?: boolean | undefined;
        hint?: string | undefined;
        options?: string[] | undefined;
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    id: string;
    title: string;
    description: string;
    questions: {
        id: string;
        type: "boolean" | "multiselect" | "multiple_choice" | "short_answer" | "long_answer" | "photo" | "location";
        required: boolean;
        question: string;
        hint?: string | undefined;
        options?: string[] | undefined;
    }[];
}, {
    id: string;
    title: string;
    description: string;
    questions: {
        id: string;
        type: "boolean" | "multiselect" | "multiple_choice" | "short_answer" | "long_answer" | "photo" | "location";
        question: string;
        required?: boolean | undefined;
        hint?: string | undefined;
        options?: string[] | undefined;
    }[];
}>;
type Survey = z.infer<typeof SurveySchema>;
type SurveyQuestion = z.infer<typeof SurveyQuestionSchema>;
type FileType = z.infer<typeof FileTypeSchema>;
type QuestionType = z.infer<typeof QuestionTypeSchema>;
export type { Survey };
export type { FileType };
export type { SurveyQuestion };
export type { QuestionType };
export { FileTypeSchema, SurveySchema, SurveyQuestionSchema, QuestionTypeSchema };
//# sourceMappingURL=schema.d.ts.map