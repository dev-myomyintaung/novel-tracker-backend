import passport from "passport";
import { Strategy as GitHubStrategy, Profile } from "passport-github2";
import {verifyOauthGeneric} from "../common/passport.service";
import {VerifyCallback} from "passport-google-oauth20";

const { GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET, API_URL } = process.env;

async function ensureEmailFromGitHub(accessToken: string, profile: Profile): Promise<Profile> {
    if (profile.emails?.length) return profile;

    // Fetch emails if missing; pick primary+verified
    const resp = await fetch("https://api.github.com/user/emails", {
        headers: {
            Authorization: `token ${accessToken}`,
            Accept: "application/vnd.github+json",
            "User-Agent": "novel-tracker-(local)",
        },
    });
    if (!resp.ok) return profile;

    const list = (await resp.json()) as Array<{ email: string; verified: boolean; primary: boolean }>;
    const best =
        list.find((e) => e.primary && e.verified)?.email ||
        list.find((e) => e.verified)?.email ||
        list[0]?.email;

    if (best) {
        (profile as any).emails = [{ value: best, verified: true }];
    }
    return profile;
}

export function registerGitHubStrategy() {
    passport.use(
        new GitHubStrategy(
            {
                clientID: GITHUB_CLIENT_ID!,
                clientSecret: GITHUB_CLIENT_SECRET!,
                callbackURL: `${API_URL}/api/v1/auth/github/callback`,
            },
            async (accessToken: string, refreshToken: string, profile: Profile, done: VerifyCallback) => {
                try {
                    const profWithEmail = await ensureEmailFromGitHub(accessToken, profile);
                    return verifyOauthGeneric({
                        provider: "github",
                        accessToken,
                        refreshToken,
                        profile: profWithEmail,
                        done,
                    });
                } catch (err) {
                    return done(err as Error);
                }
            }
        )
    );
}
