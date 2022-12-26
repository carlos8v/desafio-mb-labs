import z from 'zod'

export const findEventByIdSchema = z.object({
  eventId: z.string().uuid()
})

export type FindEventByIdValidator = typeof findEventByIdSchema
