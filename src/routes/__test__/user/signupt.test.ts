import request from "supertest";
import { app } from "../../../app";

it("returns a 201 on successful signup", async () => {
  return request(app)
    .post("/api/v1/user/signup")
    .send({
      email: "test@test.com",
      username: "test",
      password: "password",
      role: "user",
    })
    .expect(201);
});

it("returns a 400 with an invalid email", async () => {
  return request(app)
    .post("/api/v1/user/signup")
    .send({
      email: "invalid.com",
      username: "test",
      password: "password",
      role: "user",
    })
    .expect(400);
});

it("returns a 400 with an invalid username", async () => {
  return request(app)
    .post("/api/v1/user/signup")
    .send({
      email: "test@test.com",
      username: "t",
      password: "1245678",
      role: "user",
    })
    .expect(400);
});

it("returns a 400 with an invalid password", async () => {
  return request(app)
    .post("/api/v1/user/signup")
    .send({
      email: "test@test.com",
      username: "test",
      password: "12",
      role: "user",
    })
    .expect(400);
});
it("returns a 400 with an invalid role", async () => {
  return request(app)
    .post("/api/v1/user/signup")
    .send({
      email: "test@test.com",
      username: "test",
      password: "12345678",
      role: "false",
    })
    .expect(400);
});
it("returns a 400 with missing email, username and password", async () => {
  return request(app).post("/api/v1/user/signup").send({}).expect(400);
});

it("disallows duplicate emails", async () => {
  await request(app)
    .post("/api/v1/user/signup")
    .send({
      email: "test@test.com",
      username: "test",
      password: "password",
      role: "user",
    })
    .expect(201);

  await request(app)
    .post("/api/v1/user/signup")
    .send({
      email: "test@test.com",
      username: "test2",
      password: "password",
      role: "user",
    })
    .expect(400);
});

it("disallows duplicate username", async () => {
  await request(app)
    .post("/api/v1/user/signup")
    .send({
      email: "test@test.com",
      username: "test",
      password: "password",
      role: "user",
    })
    .expect(201);

  await request(app)
    .post("/api/v1/user/signup")
    .send({
      email: "test2@test.com",
      username: "test",
      password: "password",
      role: "user",
    })
    .expect(400);
});

it("sets a cookie after successful signup", async () => {
  const response = await request(app)
    .post("/api/v1/user/signup")
    .send({
      email: "test@test.com",
      username: "test",
      password: "password",
      role: "user",
    })
    .expect(201);

  expect(response.get("Set-Cookie")).toBeDefined();
});
