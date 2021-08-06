import request from "supertest";
import { app } from "../app";

export const getCookie = async () => {
  const email = "test@test.com";
  const username = "test";
  const password = "password";

  const response = await request(app)
    .post("/api/v1/user/signup")
    .send({
      email,
      username,
      password,
    })
    .expect(201);

  const cookie = response.get("Set-Cookie");

  return cookie;
};
