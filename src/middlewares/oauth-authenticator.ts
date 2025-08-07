import { Request, Response, NextFunction } from "express";
import passport from "./../services/passport.service";

const oauthAuthenticator = (req: Request, res: Response, next: NextFunction) => {
    const provider = req.params.provider as 'google';
    // call passport.authenticate with a string
    passport.authenticate(provider, {
        failureRedirect: `${process.env.FRONTEND_URL}/login`,
        session: false
    })(req, res, next);
}

export default oauthAuthenticator;