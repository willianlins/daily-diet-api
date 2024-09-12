import { FastifyReply, FastifyRequest } from 'fastify'

export async function checkUserIDExists(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const userID = request.cookies.userID

  if (!userID) {
    return reply.status(401).send({
      error: 'Unauthorized',
    })
  }
}
