import express, { Request, Response, Express, NextFunction } from "express";
import indexRouter from "./indexRoute";
import dotenv from "dotenv";
import { errorHandlingMiddleware } from "./helpers/errorHelpers";
import cors from "cors";

dotenv.config({ path: __dirname + "/../.env" });
const app: Express = express();

app.use(express.json());
app.use(cors());

app.use("/api/v1", indexRouter);

app.use(errorHandlingMiddleware);

const PORT: number = Number(process.env.PORT) || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
