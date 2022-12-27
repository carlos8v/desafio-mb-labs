import z from 'zod'

export const listEventSubscriptionsSchema = z.object({
  userId: z.string().uuid(),
  eventId: z.string().uuid()
})

export type ListEventSubscriptionsValidator = typeof listEventSubscriptionsSchema
export type ListEventSubscriptionsSchema = z.infer<typeof listEventSubscriptionsSchema>
