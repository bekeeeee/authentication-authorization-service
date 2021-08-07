import request from "supertest";
import { app } from "../app";

export const getCookie = async (n: number) => {
  const email = n === 1 ? "test@test.com" : "test2@test.com";
  const username = n === 1 ? "test" : "test2";
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
