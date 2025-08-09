import passport from "passport";
import {registerGoogleStrategy} from "./passport/passport.google";
import {registerGitHubStrategy} from "./passport/passport.github";

export function registerPassportStrategies() {
    registerGoogleStrategy();
    registerGitHubStrategy();
}

export default passport;
