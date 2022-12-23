import z from 'zod'

export const listEventSubscriptionsSchema = z.object({
  userId: z.string().uuid(),
  eventId: z.string().uuid()
})

export type ListEventSubscriptionsSchema = z.infer<typeof listEventSubscriptionsSchema>
