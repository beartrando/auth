import * as profileController from "../controllers/profile.controller";
import {Router} from "../router";

export default function registerProfileRoutes(
    router: Router,
) {
    router.get('/profile/getMe', profileController.getMe);
    router.get('/profile/get', profileController.get);
}

