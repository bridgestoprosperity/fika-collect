import z from 'zod';

const responseSchema = z.object({
  status: z.number().required(),
  body: z.string().required(),
  error: z.string(),
});

export {responseSchema};
