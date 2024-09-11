import "dotenv/config";
import express, { Express } from "express";
import { router } from "./v1/routes/route.ts";

const app: Express = express();
const port = process.env.PORT || 3000;

router(app);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
