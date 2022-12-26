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

      if (newUser.isLeft()) {
        return res.status(400).json(newUser.value)
      }

      return res.status(201).json(newUser.value)
    } catch (error) {
      return res.status(500).json({ error })
    }
  }
}
