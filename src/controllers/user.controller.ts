import {NextFunction, Request, Response} from "express";
import * as UserServices from "../services/user.service";

export const getUserById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const {user} = req;
        const userData = await UserServices.getUserById(user?.id);
        res.json(userData);
    } catch (err) {
        next(err);
    }
}
