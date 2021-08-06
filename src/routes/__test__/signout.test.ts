import request from "supertest";
import { app } from "../../app";

it("clear the cookie after signing out", async () => {
  const authResponse = await request(app)
    .post("/api/v1/user/signup")

    .send({
      email: "test@test.com",
      username: "test",
      password: "password",
    })
    .expect(201);

  const response = await request(app)
    .get("/api/v1/user/signout")
    .send()
    .expect(200);

  expect(response.get("Set-Cookie")[0]).toEqual(
    "jwt=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; httponly"
  );
});
