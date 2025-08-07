import passport from 'passport';
import {Strategy as GoogleStrategy} from 'passport-google-oauth20';
import {prisma} from "../models/prisma-client";
import jwt from 'jsonwebtoken';
import bcrypt from "bcrypt";
import * as crypto from "node:crypto";

const {GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, PORT, API_URL, JWT_SECRET} = process.env;

interface VerifyOauthParams {
    provider: string;
    accessToken: string;
    refreshToken: string;
    profile: any;
    done: Function;
}
async function verifyOauth({
    done, profile, accessToken, refreshToken, provider
                           }: VerifyOauthParams) {
    try {
        const email = profile.emails?.[0].value!;
        const displayName = profile.displayName;
        const avatarUrl = profile.photos?.[0]?.value;
        const randomPw = crypto.randomUUID() as string;
        const hashedPw = await bcrypt.hash(randomPw, 10);

        // 1. Find or create a user
        let user = await prisma.user.findUnique({
            where: {
                email
            }
        })
        if(!user){
            user = await prisma.user.create({
                data: {
                    email,
                    image: avatarUrl,
                    firstName:  displayName.split(' ')[0],
                    lastName: displayName.split(' ').slice(1).join(' '),
                    password: hashedPw,
                    accounts: {
                        create: {
                            provider,
                            providerAccountId: profile.id,
                            accessToken,
                            refreshToken
                        }
                    }
                }
            })
        } else {
            // Existing user → link new provider if missing
            const existingAcct = await prisma.account.findUnique({
                where: {
                    provider_providerAccountId: {
                        provider,
                        providerAccountId: profile.id
                    }
                }
            })
            if(!existingAcct){
                await prisma.account.create({
                    data: {
                        user: {
                            connect: {
                                id: user.id
                            }
                        },
                        provider,
                        providerAccountId: profile.id,
                        accessToken,
                        refreshToken
                    }
                })
            }
        }

        // Issue a short-lived JWT
        const token = jwt.sign(
            { id: user.id, email: user.email },
            JWT_SECRET!,
            { expiresIn: '1h' }
        );
        // Pass the token back to Passport
        done(null, `Bearer ${token}`);
    }catch (err) {
        done(err as Error);
    }
}

passport.use(
    new GoogleStrategy({
        clientID: GOOGLE_CLIENT_ID!,
        clientSecret: GOOGLE_CLIENT_SECRET!,
        callbackURL: `${API_URL}/api/v1/auth/google/callback`,
    }, (at, rt, profile, done) => verifyOauth({
        done,
        profile,
        accessToken: at,
        refreshToken: rt,
        provider: 'google'
    })
));

export default passport;
