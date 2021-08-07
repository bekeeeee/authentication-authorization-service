import request from "supertest";
import mongoose from "mongoose";

import { app } from "../../../app";
import { getCookie } from "../../../test/getCookie";
import { createPostTest } from "../../../test/createPost";



it("can only be accessed if the user is signed in", async () => {
  const id = new mongoose.Types.ObjectId().toHexString();

  await request(app).delete(`/api/v1/post/${id}`).expect(401);
});

it("returns a 400 if the provided id does not exist", async () => {
  const cookie = await getCookie("user");
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app)
    .delete(`/api/v1/post/${id}`)
    .set("Cookie", cookie)
    .expect(400);
});

it("returns a 401 if the user is not authenticated", async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app).delete(`/api/v1/post/${id}`).expect(401);
});

it("returns a 401 if the user does not own the post or admin", async () => {
  const cookie = await getCookie("user");
  const cookie_2 = await getCookie("user");

  const response = await createPostTest(cookie);

  await request(app)
    .delete(`/api/v1/post/${response.body.post._id}`)
    .set("Cookie", cookie_2)

    .expect(401);
});


it("returns a 201 if the user is admin", async () => {
    const cookie = await getCookie("user");
    const cookie_2 = await getCookie("admin");
  
    const response = await createPostTest(cookie);
  
    await request(app)
      .delete(`/api/v1/post/${response.body.post._id}`)
      .set("Cookie", cookie_2)
  
      .expect(201);
  });


  it("returns a 201 if the post is written by user", async () => {
    const cookie = await getCookie("user");
  
    const response = await createPostTest(cookie);
  
    await request(app)
      .delete(`/api/v1/post/${response.body.post._id}`)
      .set("Cookie", cookie)
  
      .expect(201);
  });


