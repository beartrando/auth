// index.ts
import {Router} from "./router";
import registerAuthRoutes from "./routes/auth.routes";
import registerProfileRoutes from "./routes/profile.routes";

const router = new Router();

registerAuthRoutes(router);
registerProfileRoutes(router);

export default router;
