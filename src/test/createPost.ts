import request from "supertest";

import { app } from "../app";

export const createPostTest = async (cookie: string[]) => {
  return await request(app).post("/api/v1/post").set("Cookie", cookie).send({
    title: "test",
    text: "test",
  });
};
