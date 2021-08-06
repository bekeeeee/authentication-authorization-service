import request from "supertest";
import { app } from "../../app";

const getCookie = async () => {
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

it("responds with details about the current user", async () => {
  const cookie = await getCookie();
  //   console.log(authResponse.get("Set-Cookie"));

  const response = await request(app)
    .get("/api/v1/user/currentUser")
    .set("Cookie", cookie)
    .send()
    .expect(200);
  expect(response.body.currentUser.username).toEqual("test");
});

it("responds with null if not authenticated", async () => {
  const response = await request(app)
    .get("/api/v1/user/currentUser")
    .send()
    .expect(200);

  expect(response.body.currentUser).toEqual(null);
});
