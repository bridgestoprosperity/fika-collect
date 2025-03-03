import z from 'zod';

const responseSchema = z.object({
  statusCode: z.number(),
  body: z.string(),
  error: z.string().optional(),
});

export {responseSchema};
