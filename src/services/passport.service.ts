import passport from 'passport';
import {Strategy as GoogleStrategy} from 'passport-google-oauth20';
import {prisma} from "../models/prisma-client";
import jwt from 'jsonwebtoken';
import bcrypt from "bcrypt";
import * as crypto from "node:crypto";
import {normalizeProfile} from "../utils/auth";
import {VerifyOauthParams} from "../types/auth";

const {GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, API_URL, JWT_SECRET, JWT_EXPIRES_IN} = process.env;

const allowed = new Set(['google', 'github', 'facebook']); // extend as needed

export function getProvider(p?: string) {
    if (!p || !allowed.has(p)) throw Object.assign(new Error('Unknown provider'), { status: 400 });
    return p as typeof allowed extends Set<infer T> ? T : never;
}

export async function verifyOauthGeneric({ provider, accessToken, refreshToken, profile, done }: VerifyOauthParams) {
    try {
        const p = normalizeProfile(provider, profile);

        if (!p.email) return done(new Error(`No email returned from ${provider}.`));
        if (p.emailVerified === false) return done(new Error(`Email must be verified on ${provider}.`));

        const user = await prisma.$transaction(async (tx) => {
            let user = await tx.user.findUnique({ where: { email: p.email! } });

            if (!user) {
                const randomPw = crypto.randomUUID();
                const hashedPw = await bcrypt.hash(randomPw, 10);
                user = await tx.user.create({
                    data: {
                        email: p.email!,
                        firstName: p.givenName ?? p.displayName?.split(' ')[0] ?? 'User',
                        lastName: p.familyName ?? (p.displayName?.includes(' ') ? p.displayName.split(' ').slice(1).join(' ') : ''),
                        image: p.avatarUrl,
                        password: hashedPw,
                        accounts: {
                            create: { provider, providerAccountId: p.providerAccountId, accessToken, refreshToken },
                        },
                    },
                });
            } else {
                const existing = await tx.account.findUnique({
                    where: { provider_providerAccountId: { provider, providerAccountId: p.providerAccountId } },
                });
                if (!existing) {
                    await tx.account.create({
                        data: { userId: user.id, provider, providerAccountId: p.providerAccountId, accessToken, refreshToken },
                    });
                }
            }

            return user;
        });

        const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET!, { expiresIn: JWT_EXPIRES_IN as any });
        return done(null, token);
    } catch (err) {
        return done(err);
    }
}

// keep scopes in a map so routes stay generic
export const scopesMap: Record<string, string[]> = {
    google: ['profile', 'email'],
    github: ['user:email'],
    facebook: ['public_profile', 'email'],
};

passport.use(
    new GoogleStrategy({
        clientID: GOOGLE_CLIENT_ID!,
        clientSecret: GOOGLE_CLIENT_SECRET!,
        callbackURL: `${API_URL}/api/v1/auth/google/callback`,
    }, (at, rt, profile, done) => verifyOauthGeneric({
        done,
        profile,
        accessToken: at,
        refreshToken: rt,
        provider: 'google'
    })
));

export default passport;
