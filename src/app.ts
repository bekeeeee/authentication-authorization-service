import Express, { Request, Response, NextFunction } from "express";
import cookieSession from "cookie-session";
import "express-async-errors";
import { json } from "body-parser";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import mongoSanitize from "express-mongo-sanitize";
import xss from "xss-clean";
import cors from "cors";

import { userRouter } from "./routes/userRoutes";
import { postRouter } from "./routes/postRoutes";
import { errorHandler } from "./middlewares/error-handler";
import { NotFoundError } from "./errors/not-found-error";
import { currentUserMiddleware } from "./middlewares/current-user";

const app = Express();
// Limit requests from same API
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: "Too many requests from this IP, please try again in an hour!",
});
// 1) GLOBAL MIDDLEWARES

// Set secuirty HTTP headers
app.use(helmet());

// Implement CORS
app.use(cors());

// bodyParser, read data from body to req.body
app.use(json());

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against xss
app.use(xss());

// Proxy
app.set("trust proxy", true);

// cookieSession
app.use(
  cookieSession({
    name: "jwt",
    signed: false,
    secure: false,
  })
);
// app.use("/api", limiter);

// UserRouter
app.use("/api/v1/user", userRouter);

// postRouter
app.use("/api/v1/post", currentUserMiddleware, postRouter);

// Not found route
app.all("*", async (req: Request, res: Response, next: NextFunction) => {
  next(new NotFoundError());
});

// Error handler
app.use(errorHandler);
export { app };
