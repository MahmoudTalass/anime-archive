import { Router } from "express";
import animesRouter from "./anime/animeRoutes";

const router: Router = Router();

router.use("/animes", animesRouter);

export default router;
