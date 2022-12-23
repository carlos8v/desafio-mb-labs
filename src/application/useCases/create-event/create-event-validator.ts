import z from 'zod'

export const createEventSchema = z.object({
  title: z.string(),
  subtitle: z.string(),
  description: z.string().nullish(),
  dueDate: z.preprocess((arg) => {
    if (typeof arg == "string" || arg instanceof Date) return new Date(arg)
  }, z.date()),
  ticketPrice: z.number(),
  link: z.string().nullish(),
  place: z.string().nullish(),
  createdBy: z.string().uuid()
})

export type CreateEventSchema = z.infer<typeof createEventSchema>
