import { Router } from 'express'

import { createUserController } from '../controller/create-user'

export const userRouter = Router()

userRouter.post('/', createUserController)
