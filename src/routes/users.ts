import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { knex } from '../database'
import { randomUUID } from 'crypto'
// import { checkUserIDExists } from '../middlewares/check-user-id-existis'

export async function usersRoutes(app: FastifyInstance) {
  app.get('/', async () => {
    const users = await knex('users')

    return { users }
  })

  app.post('/create-user', async (request, reply) => {
    const createUserBodySchema = z.object({
      name: z.string(),
    })

    let userID = request.cookies.userID

    if (!userID) {
      userID = randomUUID()

      reply.cookie('userID', userID, {
        path: '/',
        maxAge: 60 * 60 * 24 * 7, // 7days
      })
    }

    const { name } = createUserBodySchema.parse(request.body)

    await knex('users').insert({
      id: userID,
      name,
    })

    return reply.status(201).send()
  })
}
