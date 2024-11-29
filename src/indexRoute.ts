import { Router } from "express";
import animeRouter from "./anime/animeRoutes";
import authRouter from "./auth/authRoutes";
import userRouter from "./user/userRoutes";

const router: Router = Router();

router.use("/animes", animeRouter);
router.use("/auth", authRouter);
router.use("/me", userRouter);

export default router;
