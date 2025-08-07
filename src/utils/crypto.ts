import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret'

export const hashPassword = (plain: string): Promise<string> => {
    return bcrypt.hash(plain, 10)
}

export const generateToken = (user: { id: number; email: string }) => {
    return jwt.sign(user, JWT_SECRET, { expiresIn: '7d' })
}

export const comparePassword = (plain: string, hashed: string) => {
    return bcrypt.compare(plain, hashed)
}
