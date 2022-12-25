import type { Schema } from 'zod'
import type { CreateUserUseCase } from '@application/useCases/create-user/create-user'

type CreateUserController = Controller<{
  createUserUseCase: CreateUserUseCase
  createUserSchema: Schema
}>

export const createUserControllerFactory: CreateUserController = ({
  createUserUseCase,
  createUserSchema
}) => {
  return async (req, res) => {
    try {
      const userData = createUserSchema.parse(req.body)
      const newUser = await createUserUseCase(userData)
      return res.status(201).json(newUser)
    } catch (error) {
      return res.status(400).json({ error })
    }
  }
}
