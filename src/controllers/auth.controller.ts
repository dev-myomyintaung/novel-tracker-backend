import {Request, Response, NextFunction} from "express";
import {login, register} from "../services/auth.service";
import passport from "./../services/passport.service";

const {FRONTEND_URL} = process.env;

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

// kicks off the redirect to the provider’s consent page
export const initiateSocialLogin  = async(req: Request, res: Response, next: NextFunction) =>{
   try{
       const {provider} = req.params;
       const scopes = provider === 'google' ? ['profile', 'email'] : [];
       passport.authenticate(provider, {scope: scopes, session: false})(req, res, next);
   } catch (err) {
       next(err)
   }
};

// handles the callback once the user has authenticated with the provider
export const handleSocialLoginCallback   = async(req: Request, res: Response)=>{
    // passport handle set the token at req.user
    const token = req.user as unknown as string;
    res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 3600 * 1000 // 1h
    });
    res.redirect(`${FRONTEND_URL!}/`);
}
