import userService from '../services/user.js'

const getAllUsers = async (ctx) => {
  ctx.body = await userService.getUsers()
}

const createUser = async (ctx) => {
  ctx.body = await userService.createUser(ctx.request.body)
  ctx.status = 201
}

export default { getAllUsers, createUser }
