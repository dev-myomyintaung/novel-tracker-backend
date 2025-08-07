import { Request, Response, NextFunction } from "express";

export function requireAdmin(req: Request, res: Response, next: NextFunction) {
    if (!req.user?.isAdmin) {
        return res.status(403).json({ error: "Forbidden – admin only" });
    }
    next();
}
