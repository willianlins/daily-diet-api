import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { checkUserIDExists } from '../middlewares/check-user-id-existis'
import { knex } from '../database'

export async function mealsRoutes(app: FastifyInstance) {
  app.post(
    '/register',
    { preHandler: [checkUserIDExists] },
    async (request, reply) => {
      const createMealsBodySchema = z.object({
        name: z.string(),
        description: z.string(),
        diet: z.boolean(),
      })
      const { name, description, diet } = createMealsBodySchema.parse(
        request.body,
      )

      await knex('meals')
        .insert({
          user_id: request.cookies.userID,
          name,
          description,
          diet,
        })
        .debug(true)

      return reply.status(201).send()
    },
  )

  app.get(
    '/view/:name',
    { preHandler: [checkUserIDExists] },
    async (request) => {
      const getMealsTransactionsSchema = z.object({
        name: z.string(),
      })

      const { name } = getMealsTransactionsSchema.parse(request.params)

      const { userID } = request.cookies

      const meals = await knex('meals').where({ user_id: userID, name })

      return { meals }
    },
  )

  app.get('/view-user/:id', async (request) => {
    const getMealsTransactionsSchema = z.object({
      id: z.string().uuid(),
    })

    const { id } = getMealsTransactionsSchema.parse(request.params)

    const meals = await knex('meals').where({ user_id: id })

    return { meals }
  })

  app.get('/', { preHandler: [checkUserIDExists] }, async (request) => {
    const { userID } = request.cookies

    const meals = await knex('meals').where('user_id', userID)

    return { meals }
  })

  app.delete(
    '/remove/:name',
    { preHandler: [checkUserIDExists] },
    async (request, reply) => {
      const getMealsRemoveBodySchema = z.object({
        name: z.string(),
      })

      const { userID } = request.cookies

      const { name } = getMealsRemoveBodySchema.parse(request.params)

      await knex('meals').delete().where({ user_id: userID, name })

      return reply.status(201).send()
    },
  )

  app.post(
    '/update/:name',
    { preHandler: [checkUserIDExists] },
    async (request, reply) => {
      const updateDataMealsSchema = z.object({
        name: z.string(),
        description: z.string(),
        diet: z.boolean(),
        date: z.string(),
      })

      const getParamsSchema = z.object({
        name: z.string(),
      })

      const { date, description, diet, name } = updateDataMealsSchema.parse(
        request.body,
      )

      const { name: nameParams } = getParamsSchema.parse(request.params)

      const { userID } = request.cookies

      await knex('meals')
        .where({ user_id: userID, name: nameParams })
        .update({
          name,
          description,
          diet,
          date,
        })
        .debug(true)

      return reply.status(200).send()
    },
  )

  app.get('/metrics/:user_id', async (request) => {
    const getUserIdParamsSchema = z.object({
      user_id: z.string().uuid(),
    })

    const userID = getUserIdParamsSchema.parse(request.params)

    const data = await knex('meals').where(userID)

    const metrics = data.reduce(
      (result, valor) => {
        return { meals: 0, mealsOnDiet: 0, mealsOfDiet: 0, sequence: 0 }
      },
      {
        meals: 0,
        mealsOnDiet: 0,
        mealsOfDiet: 0,
        sequence: 0,
      },
    )

    return { data }
  })
}
