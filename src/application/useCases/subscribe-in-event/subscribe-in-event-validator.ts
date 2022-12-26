import z from 'zod'

export const subscribeInEventSchema = z.object({
  eventId: z.string().uuid(),
  userId: z.string().uuid(),
  ticketPrice: z.number().min(0)
})

export type SubscribeInEventSchema = z.infer<typeof subscribeInEventSchema>
export type SubscribeInEventValidator = typeof subscribeInEventSchema
