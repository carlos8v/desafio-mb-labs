import z from 'zod'

export const findEventSubscriptionsSchema = z.object({
  userId: z.string().uuid(),
  eventId: z.string().uuid()
})

export type FindEventSubscriptionsValidator = typeof findEventSubscriptionsSchema
export type FindEventSubscriptionsSchema = z.infer<typeof findEventSubscriptionsSchema>
