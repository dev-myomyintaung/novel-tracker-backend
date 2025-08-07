// src/types/express.d.ts
import { JwtPayload } from "jsonwebtoken";

export interface JwtUserPayload extends JwtPayload {
    id: number;
    email: string;
}

// Augment the Request interface in express-serve-static-core:
declare module "express-serve-static-core" {
    interface Request {
        user?: JwtUserPayload;
    }
}
