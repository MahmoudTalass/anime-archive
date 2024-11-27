import express, { Express } from "express";
import indexRouter from "./indexRoute";
import dotenv from "dotenv";

dotenv.config({ path: __dirname + "/../.env" });
const app: Express = express();

app.use("/api/v1", indexRouter);

const PORT: number = Number(process.env.PORT) || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
