import express, { Request, Response, Express, NextFunction } from "express";
import indexRouter from "./indexRoute";
import dotenv from "dotenv";
import { errorHandlingMiddleware } from "./helpers/errorHelpers";
import cors from "cors";
import connectToDb from "./config/dbConfig";

dotenv.config({ path: __dirname + "/../.env" });
const app: Express = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
connectToDb(process.env.MONGO_URI as string);

app.use("/api/v1", indexRouter);

app.use(errorHandlingMiddleware);

const PORT: number = Number(process.env.PORT) || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
