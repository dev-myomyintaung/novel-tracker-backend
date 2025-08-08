import express from "express";
import {
    loginUser,
    registerUser,
    initiateSocialLogin, handleSocialLoginCallback, oauthAuthenticator, logout
} from "../controllers/auth.controller";
import {validateLoginUser, validateRegisterUser} from "../middlewares/validator/auth.validator";
const router = express.Router();

router.post("/login", validateLoginUser, loginUser);
router.post("/register", validateRegisterUser, registerUser);
router.post("/logout", logout);
router.get("/:provider", initiateSocialLogin )
router.get("/:provider/callback",
    oauthAuthenticator,
    handleSocialLoginCallback )

export default router;
