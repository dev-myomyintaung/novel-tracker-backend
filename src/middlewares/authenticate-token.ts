import {NextFunction, Request, Response} from "express";
import jwt from "jsonwebtoken";
import {JwtUserPayload} from "../types/express";
import {prisma} from "../models/prisma-client";

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret'

const authenticateToken = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ error: 'Unauthorized' });

    try {
        req.user = jwt.verify(
            token,
            JWT_SECRET as string
        ) as JwtUserPayload;

        next();
    } catch (err) {
        return res.status(403).json({ error: 'Invalid token' });
    }
};

export default authenticateToken;
