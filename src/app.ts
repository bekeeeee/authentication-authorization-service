import Express, { Request, Response, NextFunction } from "express";
import cookieSession from "cookie-session";
import "express-async-errors";
import { json } from "body-parser";
import cors from "cors";
import { userRouter } from "./routes/userRoutes";
import { errorHandler } from "./middlewares/error-handler";
import { NotFoundError } from "./errors/not-found-error";

const app = Express();

app.use(json());
app.set("trust proxy", true);
app.use(cors());
app.use(
  cookieSession({
    name: "jwt",
    signed: false,
    secure: false,
  })
);
app.use("/api/v1/user", userRouter);

app.all("*", async (req: Request, res: Response, next: NextFunction) => {
  next(new NotFoundError());
});
app.use(errorHandler);
export { app };
