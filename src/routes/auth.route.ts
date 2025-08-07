import express from "express";
import {
    loginUser,
    registerUser,
    initiateSocialLogin, handleSocialLoginCallback
} from "../controllers/auth.controller";
import {validateLoginUser, validateRegisterUser} from "../middlewares/validator/auth.validator";
import oauthAuthenticator from "../middlewares/oauth-authenticator";
const router = express.Router();

router.post("/login", validateLoginUser, loginUser);
router.post("/register", validateRegisterUser, registerUser);
router.get("/:provider", initiateSocialLogin )
router.get("/:provider/callback",
    oauthAuthenticator,
    handleSocialLoginCallback )


export default router;
