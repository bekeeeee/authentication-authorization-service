import request from "supertest";
import { app } from "../../../app";
import { getCookie } from "../../../test/getCookie";

it("responds with details about the current user", async () => {
  const responseSignup = await request(app)
    .post("/api/v1/user/signup")
    .send({
      email: "test@test.com",
      username: "test",
      password: "password",
      role:"user"
    })
    .expect(201);

  const cookie = responseSignup.get("Set-Cookie");
  const response = await request(app)
    .get("/api/v1/user/currentUser")
    .set("Cookie", cookie)
    .send()
    .expect(200);
  expect(response.body.currentUser.username).toEqual("test");
});

it("responds with null if not authenticated", async () => {
  await request(app).get("/api/v1/user/currentUser").send().expect(401);
});
