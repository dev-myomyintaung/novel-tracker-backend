// auth/normalize.ts
import type { OAuthProvider, NormalizedProfile } from '../types/auth';

export function normalizeProfile(provider: OAuthProvider, raw: any): NormalizedProfile {
    switch (provider) {
        case 'google': {
            const email = raw._json?.email ?? raw.emails?.[0]?.value ?? null;
            const emailVerified = raw._json?.email_verified ?? null;
            const givenName = raw._json?.given_name ?? raw.name?.givenName ?? null;
            const familyName = raw._json?.family_name ?? raw.name?.familyName ?? null;
            const displayName = raw.displayName ?? null;
            const avatarUrl = raw._json?.picture ?? raw.photos?.[0]?.value ?? null;
            return {
                provider: 'google',
                providerAccountId: String(raw.id),
                email,
                emailVerified,
                displayName,
                givenName,
                familyName,
                avatarUrl
            };
        }
        case 'github': {
            // request scope: ['user:email'] to get emails
            const email = raw.emails?.find((e: any) => e?.primary)?.value ?? raw.emails?.[0]?.value ?? null;
            const displayName = raw.displayName ?? raw.username ?? null;
            const avatarUrl = raw.photos?.[0]?.value ?? null;
            return {
                provider: 'github',
                providerAccountId: String(raw.id),
                email,
                emailVerified: null,
                displayName,
                givenName: null,
                familyName: null,
                avatarUrl
            };
        }
        case 'facebook': {
            // ensure 'email' is in scope
            const email = raw.emails?.[0]?.value ?? null;
            const displayName = raw.displayName ?? null;
            const avatarUrl = raw.photos?.[0]?.value ?? null;
            return {
                provider: 'facebook',
                providerAccountId: String(raw.id),
                email,
                emailVerified: null,
                displayName,
                givenName: null,
                familyName: null,
                avatarUrl
            };
        }
        default:
            throw new Error(`Unsupported provider: ${provider}`);
    }
}
