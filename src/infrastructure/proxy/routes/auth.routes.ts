import * as authController from "../controllers/auth.controller";
import {Router} from "../router";

export default function registerAuthRoutes(
    router: Router,
) {
    router.post("/auth/anonymousSignIn", authController.anonymousSignIn, false);
    router.get("/auth/getMe", authController.getMe);
    router.post("/auth/refreshTokens", authController.refreshTokens, false);
}