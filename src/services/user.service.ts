import {prisma} from "../models/prisma-client";
import {NotFound} from "http-errors";
import {User} from "@prisma/client";

function excludePassword(user: User){
    const {password, ...rest} = user
    return rest
}

export const getUserById = async(id?: number)=>{
    const user = await prisma.user.findUnique({
        where: {
            id
        }
    })

    if(!user){
        throw NotFound("User not found")
    }

    return excludePassword(user)
}

