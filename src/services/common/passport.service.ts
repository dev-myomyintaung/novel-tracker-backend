// src/services/auth-common.ts
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import crypto from "node:crypto";
import type { Profile } from "passport";
import {prisma} from "../../models/prisma-client";
import {VerifyOauthParams} from "../../types/auth";

const { JWT_SECRET, JWT_EXPIRES_IN } = process.env;

export type Provider = "google" | "github" | "facebook";
export const allowed = new Set<Provider>(["google", "github", "facebook"]);

export function getProvider(p?: string): Provider {
    if (!p || !allowed.has(p as Provider)) {
        const err = new Error("Unknown provider") as any;
        err.status = 400;
        throw err;
    }
    return p as Provider;
}

export function normalizeProfile(provider: Provider, profile: Profile) {
    // normalize to one shape
    const primaryEmail = profile.emails?.[0]?.value ?? null;

    return {
        provider,
        providerAccountId: profile.id,
        email: primaryEmail, // github may be null; github strategy can override
        emailVerified: (profile.emails as any)?.[0]?.verified ?? undefined,
        displayName: profile.displayName ?? profile.username ?? "",
        givenName: (profile as any).name?.givenName ?? undefined,
        familyName: (profile as any).name?.familyName ?? undefined,
        avatarUrl: profile.photos?.[0]?.value ?? null,
        username: (profile as any).username ?? null,
    };
}

export async function verifyOauthGeneric({
                                             provider, accessToken, refreshToken, profile, done,
                                         }: VerifyOauthParams) {
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
                        firstName: p.givenName ?? p.displayName.split(" ")[0] ?? "User",
                        lastName: p.familyName ?? (p.displayName.includes(" ") ? p.displayName.split(" ").slice(1).join(" ") : ""),
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

export const scopesMap: Record<string, string[]> = {
    google: ["profile", "email"],
    github: ["user:email"],
    facebook: ["public_profile", "email"],
};
