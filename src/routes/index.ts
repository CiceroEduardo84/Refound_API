import { Router } from "express";
import { usersRoutes } from "./users.routes";
import { sessionsRoutes } from "./sessions.routes";
import { refundsRoutes } from "./refound.routes";
import { ensureAuthenticated } from "@/middlewares/ensureAuthenticated";
import { uploadsRoutes } from "./uploads.routes";

const routes = Router();

// Rotas públicas
routes.use("/users", usersRoutes);
routes.use("/sessions", sessionsRoutes);

// Rotas privadas
routes.use(ensureAuthenticated);
routes.use("/refunds", refundsRoutes);
routes.use("/uploads", uploadsRoutes);

export { routes };
