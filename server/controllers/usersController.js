import { Note } from '../models/Note.js'
import { User } from '../models/User.js'
import asyncHandler from 'express-async-handler'
import bcrypt from 'bcrypt'

export const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select('-password').lean()

  if (!users?.length) {
    return res.status(400).json({ message: 'No users found' })
  }

  res.json(users)
})

export const createNewUser = asyncHandler(async (req, res) => {
  const { username, password, roles } = req.body

  if (!username || !password || !Array.isArray(roles) || !roles.length) {
    return res.status(400).json({ message: 'All fields are required' })
  }

  const duplicate = await User.findOne({ username }).lean().exec()

  if (duplicate) {
    return res.status(409).json({ message: 'Duplicate username' })
  }

  const hashedPwd = await bcrypt.hash(password, 10)

  const userObject = { username, password: hashedPwd, roles }

  const user = await User.create(userObject)

  if (user) {
    res.status(201).json({ message: `New user ${username} created` })
  } else {
    res.status(400).json({ message: 'Invalid user data received' })
  }
})

export const updateUser = asyncHandler(async (req, res) => {
  const { id, username, roles, active, password } = req.body

  if (
    !id ||
    !username ||
    !Array.isArray(roles) ||
    !roles.length ||
    typeof active !== 'boolean'
  ) {
    return res
      .status(400)
      .json({ message: 'All fields except password are required' })
  }

  const user = await User.findById(id).exec()

  if (!user) {
    return res.status(400).json({ message: 'User not found' })
  }

  const duplicate = await User.findOne({ username }).lean().exec()

  if (duplicate && duplicate?._id.toString() !== id) {
    return res.status(409).json({ message: 'Duplicate username' })
  }

  user.username = username
  user.roles = roles
  user.active = active

  if (password) {
    user.password = await bcrypt.hash(password, 10) // salt rounds
  }

  const updatedUser = await user.save()

  res.json({ message: `${updatedUser.username} updated` })
})

export const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.body

  if (!id) {
    return res.status(400).json({ message: 'User ID Required' })
  }

  const note = await Note.findOne({ user: id }).lean().exec()
  if (note) {
    return res.status(400).json({ message: 'User has assigned notes' })
  }

  const user = await User.findById(id).exec()

  if (!user) {
    return res.status(400).json({ message: 'User not found' })
  }

  const result = await user.deleteOne()

  const reply = `Username ${result.username} with ID ${result._id} deleted`

  res.json(reply)
})
