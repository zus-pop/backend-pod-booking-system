import cors from "cors";
import "dotenv/config";
import express, { Express } from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { socketAuth } from "./middlewares/socketAuth.ts";
import { initialize } from "./utils/socket-stuffs.ts";
import { router } from "./v1/routes/route.ts";
import { swaggerSpec, swaggerUI } from "./v1/swagger/swagger.ts";

const app: Express = express();
const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
    },
    connectionStateRecovery: {},
});
const port = process.env.PORT || 3000;

declare module "express-serve-static-core" {
    interface Request {
        [key: string]: any;
        file?: Express.Multer.File;
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

io.use(socketAuth);

initialize(io);

server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
