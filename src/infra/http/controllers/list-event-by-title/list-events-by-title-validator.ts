import z from 'zod'

export const listEventsByTitleSchema = z.object({
  title: z.string().default('')
})

export type ListEventsByTitleValidator = typeof listEventsByTitleSchema
