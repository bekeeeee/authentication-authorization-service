import request from "supertest";
import { app } from "../../../app";

it("return a 200 successful signin", async () => {
  await request(app)
    .post("/api/v1/user/signup")
    .send({
      email: "test@test.com",
      username: "test",
      password: "password",
    })
    .expect(201);

  await request(app)
    .post("/api/v1/user/signin")
    .send({
      email: "test@test.com",
      password: "password",
    })
    .expect(200);
});

it("fails when an incorrect password is supplied", async () => {
  await request(app)
    .post("/api/v1/user/signup")
    .send({
      email: "test@test.com",
      username: "test",
      password: "password",
    })
    .expect(201);
  await request(app)
    .post("/api/v1/user/signin")
    .send({
      email: "test@test.com",
      password: "invalidpassword",
    })
    .expect(400);
});

it("fails when an incorrect email is supplied", async () => {
  await request(app)
    .post("/api/v1/user/signup")
    .send({
      email: "test@test.com",
      username: "test",
      password: "password",
    })
    .expect(201);
  await request(app)
    .post("/api/v1/user/signin")
    .send({
      email: "invalid@test.com",
      password: "invalidpassword",
    })
    .expect(400);
});

it("return a 200 successful signin", async () => {
  await request(app)
    .post("/api/v1/user/signup")
    .send({
      email: "test@test.com",
      username: "test",
      password: "password",
    })
    .expect(201);

  const response = await request(app)
    .post("/api/v1/user/signin")
    .send({
      email: "test@test.com",
      password: "password",
    })
    .expect(200);
  expect(response.get("Set-Cookie")).toBeDefined();
});
