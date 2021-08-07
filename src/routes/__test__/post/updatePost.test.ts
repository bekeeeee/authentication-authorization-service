import request from "supertest";
import mongoose from "mongoose";

import { app } from "../../../app";
import { getCookie } from "../../../test/getCookie";
import { Post } from "../../../models/PostModel";
it("can only be accessed if the user is signed in", async () => {
  const id = new mongoose.Types.ObjectId().toHexString();

  await request(app).patch(`/api/v1/post/${id}`).send({}).expect(401);
});

it("returns a 400 if the provided id does not exist", async () => {
  const cookie = await getCookie(1);
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app)
    .patch(`/api/v1/post/${id}`)
    .set("Cookie", cookie)
    .send({
      title: "test",
      text: "test",
    })
    .expect(400);
});

it("returns a 401 if the user is not authenticated", async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app)
    .patch(`/api/v1/post/${id}`)
    .send({
      title: "test",
      text: "test",
    })
    .expect(401);
});

it("returns a 401 if the user does not own the ticket", async () => {
  const cookie = await getCookie(1);
  const cookie_2 = await getCookie(2);

  const response = await request(app)
    .post("/api/v1/post")
    .set("Cookie", cookie)
    .send({
      title: "test",
      text: "test",
    });
  await request(app)
    .patch(`/api/v1/post/${response.body.post._id}`)
    .set("Cookie", cookie_2)
    .send({
      title: "updated",
      text: "updated",
    })
    .expect(401);
});

it("returns a 400 if the user provides an invalid title or price", async () => {
  const cookie = await getCookie(1);

  const response = await request(app)
    .post("/api/v1/post")
    .set("Cookie", cookie)
    .send({
      title: "test",
      text: "test",
    });

  await request(app)
    .patch(`/api/v1/post/${response.body.post._id}`)
    .set("Cookie", cookie)
    .send({
      title: "",
      text: "test",
    })
    .expect(400);

  await request(app)
    .patch(`/api/v1/post/${response.body.post._id}`)
    .set("Cookie", cookie)
    .send({
      title: "test",
      text: "",
    })
    .expect(400);
});

it("updates the ticket provided valid inputs", async () => {
  const cookie = await getCookie(1);

  const response = await request(app)
    .post("/api/v1/post")
    .set("Cookie", cookie)
    .send({
      title: "test",
      text: "test",
    });

  await request(app)
    .patch(`/api/v1/post/${response.body.post._id}`)
    .set("Cookie", cookie)
    .send({
      title: "updated",
      text: "updated",
    })
    .expect(200);

  await request(app)
    .patch(`/api/v1/post/${response.body.post._id}`)
    .set("Cookie", cookie)
    .send({
      title: "updated",
      text: "updated",
    })
    .expect(200);
});
