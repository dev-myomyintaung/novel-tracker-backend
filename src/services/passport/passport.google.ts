// src/services/passport.google.ts
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import {verifyOauthGeneric} from "../common/passport.service";

const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, API_URL } = process.env;

export function registerGoogleStrategy() {
    passport.use(
        new GoogleStrategy(
            {
                clientID: GOOGLE_CLIENT_ID!,
                clientSecret: GOOGLE_CLIENT_SECRET!,
                callbackURL: `${API_URL}/api/v1/auth/google/callback`,
            },
            (accessToken, refreshToken, profile, done) =>
                verifyOauthGeneric({
                    provider: "google",
                    accessToken,
                    refreshToken,
                    profile,
                    done,
                })
        )
    );
}
