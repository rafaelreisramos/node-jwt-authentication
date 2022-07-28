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
  return await prisma.user.create({
    data: { ...user, password: hashedPassword },
    select: {
      id: true,
      email: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    },
  })
}

const findByEmail = async (email) =>
  await prisma.user.findUnique({
    where: { email },
    select: { id: true, role: true, password: true },
  })

export default { getUsers, createUser, findByEmail }
