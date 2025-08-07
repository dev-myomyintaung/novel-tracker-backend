import {prisma, Prisma} from "../models/prisma-client";
import {Conflict, NotFound, Unauthorized} from "http-errors";
import {comparePassword, generateToken, hashPassword} from "../utils/crypto";

export const register = async ({email,password,firstName,lastName}: Prisma.UserCreateInput ) => {
    const existingUser = await prisma.user.findUnique({ where: { email } })
    if (existingUser) {
        throw new Conflict("User already exists")
    }

    const hashedPassword = await hashPassword(password)

    return prisma.user.create({
        data: {
            email,
            password: hashedPassword,
            firstName,
            lastName,
        },
    });
}

export const login = async ({email,password}: {email: string, password: string}) => {
    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) {
        throw new NotFound("User not found")
    }
    const isMatch = await comparePassword(password, user.password)
    if (!isMatch) {
        throw new Unauthorized("Invalid credentials")
    }

    const generatedToken = generateToken({
        email: user.email,
        id: user.id
    })

    return {
        token: generatedToken
    }
}

