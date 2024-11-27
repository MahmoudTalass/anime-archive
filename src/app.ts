import express, { Request, Response, Express, NextFunction } from "express";
import indexRouter from "./indexRoute";
import dotenv from "dotenv";
import { errorHandlingMiddleware } from "./helpers/errorHelpers";

dotenv.config({ path: __dirname + "/../.env" });
const app: Express = express();

app.use("/api/v1", indexRouter);

app.use(errorHandlingMiddleware);

const PORT: number = Number(process.env.PORT) || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
