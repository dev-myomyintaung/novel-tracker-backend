// auth/types.ts
export type OAuthProvider = 'google' | 'github' | 'facebook'; // extend as needed

export type NormalizedProfile = {
    provider: OAuthProvider;
    providerAccountId: string;
    email: string | null;
    emailVerified: boolean | null;
    displayName: string | null;
    givenName: string | null;
    familyName: string | null;
    avatarUrl: string | null;
};

export type VerifyOauthParams = {
    provider: OAuthProvider;
    accessToken: string;
    refreshToken?: string;
    profile: any;
    done: (err: any, result?: any) => void;
};
