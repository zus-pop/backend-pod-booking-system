import "dotenv/config";
import express, { Express, Request, Response } from "express";

const app: Express = express();
const port = process.env.PORT || 3000;

app.get("/", (_: Request, res: Response) => {
  res.send(`<h1>Hello world</h1>`);
});
app.get("/data", (req: Request, res: Response) => {
  res.json({ message: "Hello, world!" });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
