import request from "supertest";
import { app } from "../../../app";
import { getCookie } from "../../../test/getCookie";

it("responds with details about the current user", async () => {
  const cookie = await getCookie(1);
  //   console.log(authResponse.get("Set-Cookie"));

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
