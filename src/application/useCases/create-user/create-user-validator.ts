import z from 'zod'

export const createUserSchema = z.object({
  username: z.string(),
  name: z.string(),
  email: z.string().email(),
  password: z.string(),
  description: z.string().nullish(),
  thumbnail: z.string().nullish()
})

export type CreateUserValidator = typeof createUserSchema
export type CreateUserSchema = z.infer<typeof createUserSchema>
