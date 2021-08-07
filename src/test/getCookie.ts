import request from "supertest";
import { app } from "../app";
import faker from "faker";

export const getCookie = async (role: string) => {
  const email = faker.internet.email();
  const username = faker.internet.userName();
  const password = faker.internet.password();

  const response = await request(app)
    .post("/api/v1/user/signup")
    .send({
      email,
      username,
      password,
      role,
    })
    .expect(201);

  const cookie = response.get("Set-Cookie");

  return cookie;
};
