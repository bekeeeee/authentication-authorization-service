import mongoose from "mongoose";
import * as dotenv from "dotenv";
import { DatabaseConnectionError } from "./errors/database-connection-error";

import { app } from "./app";
dotenv.config({ path: __dirname + "/.env" });

const start = async () => {
  const port = process.env.PORT || 3000;
  const DB = process.env.DATABASE || "";
  try {
    await mongoose
      .connect(DB, {
        useNewUrlParser: true,
        useFindAndModify: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
      })
      .then(() => console.log("Connected to db"));

    app.listen(port, () => {
      console.log(`Listenin on port ${port}`);
    });
  } catch (err) {
    throw new DatabaseConnectionError();
  }
};
start();
