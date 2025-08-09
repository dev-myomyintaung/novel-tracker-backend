import {Request, Response, NextFunction} from "express";
import {login, register} from "../services/auth.service";
import passport from "./../services/passport.service";
import {getProvider, Provider, scopesMap} from "../services/common/passport.service";

const {FRONTEND_URL, JWT_EXPIRES_IN} = process.env;

export const registerUser = async(req: Request, res: Response, next: NextFunction)=> {
    try{
        const {firstName, lastName, email, password} = req.body
        await register({firstName, lastName, email, password})
        res.status(201).json({ message: "User created" })
    } catch (err) {
        next(err)
    }
}

export const loginUser = async(req: Request, res: Response, next: NextFunction)=> {
    try{
        const {email, password} = req.body
        const {token} = await login({email, password})
        res.status(200).json({token})
    } catch (err) {
        next(err)
    }
}

// ENTRY: redirect to provider consent
export const initiateSocialLogin  = async(req: Request, res: Response, next: NextFunction) =>{
   try{
       const {provider} = req.params;
       const scopes = scopesMap[provider]
       passport.authenticate(provider, {scope: scopes, session: false})(req, res, next);
   } catch (err) {
       next(err)
   }
};

// Authenticate a user with an OAuth provider
export const oauthAuthenticator = (req: Request, res: Response, next: NextFunction) => {
    const provider = getProvider(req.params.provider);
    // call passport.authenticate with a string
    passport.authenticate(provider, {
        failureRedirect: `${process.env.FRONTEND_URL}/login?error=oauth_failed`,
        session: false
    })(req, res, next);
}

// EXIT: provider callback → Passport populates req.user → finalize
export const handleSocialLoginCallback   = async(req: Request, res: Response)=>{
    // passport handle set the token at req.user
    const token = req.user as unknown as string;
    const isProd = process.env.NODE_ENV === 'production';

    res.cookie('token', token, {
        httpOnly: true,
        secure: isProd,
        sameSite:  'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.redirect(`${FRONTEND_URL!}/`);
}

export const logout = (req: Request, res: Response) => {
    const isProd = process.env.NODE_ENV === 'production';

    res.clearCookie('token', {
        httpOnly: true,
        secure: isProd,
        sameSite: 'lax',
    });

    return res.status(204).send();
};
