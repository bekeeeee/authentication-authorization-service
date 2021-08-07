import request from "supertest";
import mongoose from "mongoose";

import { app } from "../../../app";
import { getCookie } from "../../../test/getCookie";
import { createPostTest } from "../../../test/createPost";
it("can only be accessed if the user is signed in", async () => {
  const id = new mongoose.Types.ObjectId().toHexString();

  await request(app).patch(`/api/v1/post/${id}`).send({}).expect(401);
});

it("returns a 400 if the provided id does not exist", async () => {
  const cookie = await getCookie("user");
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app)
    .patch(`/api/v1/post/${id}`)
    .set("Cookie", cookie)
    .send({
      text: "test",
    })
    .expect(400);
});

it("returns a 401 if the user is not authenticated", async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app)
    .patch(`/api/v1/post/${id}`)
    .send({
      text: "test",
    })
    .expect(401);
});

it("returns a 401 if the user does not own the post", async () => {
  const cookie = await getCookie("user");
  const cookie_2 = await getCookie("user");
  const response = await createPostTest(cookie);
  
  await request(app)
    .patch(`/api/v1/post/${response.body.post._id}`)
    .set("Cookie", cookie_2)
    .send({
      text: "updated",
    })
    .expect(401);
});

it("returns a 400 if the user provides an invalid text ", async () => {
  const cookie = await getCookie("user");

  const response = await createPostTest(cookie);

  await request(app)
    .patch(`/api/v1/post/${response.body.post._id}`)
    .set("Cookie", cookie)
    .send({
      text: "",
    })
    .expect(400);

  await request(app)
    .patch(`/api/v1/post/${response.body.post._id}`)
    .set("Cookie", cookie)
    .send({
    })
    .expect(400);
});

it("updates the post provided valid inputs", async () => {
  const cookie = await getCookie("user");

  const response = await createPostTest(cookie);

  await request(app)
    .patch(`/api/v1/post/${response.body.post._id}`)
    .set("Cookie", cookie)
    .send({
      text: "updated",
    })
    .expect(200);

  await request(app)
    .patch(`/api/v1/post/${response.body.post._id}`)
    .set("Cookie", cookie)
    .send({
      text: "updated",
    })
    .expect(200);
});
