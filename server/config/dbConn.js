import mongoose from 'mongoose'

export const connectDB = async () => {
  try {
    mongoose.set('strictQuery', false)
    await mongoose.connect(process.env.DATABASE_URI)
  } catch (err) {
    console.log(err)
  }
}
