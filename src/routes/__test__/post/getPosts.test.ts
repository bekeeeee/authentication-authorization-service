import request from "supertest";
import mongoose from "mongoose";

import { app } from "../../../app";
import { getCookie } from "../../../test/getCookie";
import { createPostTest } from "../../../test/createPost";

it("can only be accessed if the user is signed in", async () => {
  await request(app).get("/api/v1/post").expect(401);
});

it("returns a 200 if the user is signed in", async () => {
  const cookie = await getCookie("user");
  const cookie_2 = await getCookie("user");

  await createPostTest(cookie);
  await createPostTest(cookie);
  await createPostTest(cookie);
  await createPostTest(cookie_2);

  const response = await request(app)
    .get("/api/v1/post")
    .set("Cookie", cookie)
    .expect(200);

  expect(response.body.posts.length).toEqual(4);
});
