import "dotenv/config";
import express, { Express } from "express";
import { router } from "./v1/routes/route.ts";
import cors from "cors";
import { swaggerSpec, swaggerUI } from "./v1/swagger/swagger.ts";

const app: Express = express();
const port = process.env.PORT || 3000;

declare module "express-serve-static-core" {
    interface Request {
        [key: string]: any;
    }
}

app.use(express.json());
app.use(
    cors({
        origin: "*",
    })
);

router(app);
app.use(
    "/api-docs",
    swaggerUI.serve,
    swaggerUI.setup(swaggerSpec, { explorer: true })
);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
