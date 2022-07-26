import prisma from '../database/client.js'
import cryptoService from './crypto.js'

const getUsers = async () =>
  await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    },
  })

const createUser = async (user) => {
  const hashedPassword = await cryptoService.hash(user.password)
  const createdUser = await prisma.user.create({
    data: { ...user, password: hashedPassword },
  })
  delete createdUser.password
  return createdUser
}

const findByEmail = async (email) =>
  await prisma.user.findUnique({ where: { email } })

export default { getUsers, createUser, findByEmail }
