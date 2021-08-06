import mongoose from "mongoose";
import * as dotenv from "dotenv";

import { app } from "./app";
dotenv.config({ path: __dirname + "/.env" });

const start = async () => {
  const port = process.env.PORT || 3000;
  try {
    await mongoose
      .connect("mongodb://localhost:27017/fatura-backend", {
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
    // console.log(err);
  }
};
start();
