import { Router } from "express";
import animesRouter from "./anime/animeRoutes";
import authRouter from "./auth/authRoutes";

const router: Router = Router();

router.use("/animes", animesRouter);
router.use("/auth", authRouter);

export default router;
