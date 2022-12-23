import z from 'zod'

export const listEventsByDateSchema = z.object({
  startDate: z.preprocess((arg) => {
    if (typeof arg == "string" || arg instanceof Date) return new Date(arg)
  }, z.date()).nullish(),
  endDate: z.date()
})

export type ListEventsByDateSchema = z.infer<typeof listEventsByDateSchema>
