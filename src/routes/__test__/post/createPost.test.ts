import request from "supertest";
import { app } from "../../../app";
import { getCookie } from "../../../test/getCookie";
import { Post } from "../../../models/PostModel";
it("can only be accessed if the user is signed in", async () => {
  await request(app).post("/api/v1/post").send({}).expect(401);
});

it("returns a status other than 401 if the user is signed in", async () => {
  const cookie = await getCookie(1);
  const response = await request(app)
    .post("/api/v1/post")
    .set("Cookie", cookie)
    .send({});

  expect(response.status).not.toEqual(401);
});

it("returns an error if an invalid title is provided", async () => {
  const cookie = await getCookie(1);

  await request(app)
    .post("/api/v1/post")
    .set("Cookie", cookie)
    .send({
      title: "",
      text: "test text",
    })
    .expect(400);

  await request(app)
    .post("/api/v1/post")
    .set("Cookie", cookie)
    .send({
      text: "test text",
    })
    .expect(400);
});

it("returns an error if an invalid text is provided", async () => {
  const cookie = await getCookie(1);

  await request(app)
    .post("/api/v1/post")
    .set("Cookie", cookie)
    .send({
      title: "test title",
      text: "",
    })
    .expect(400);

  await request(app)
    .post("/api/v1/post")
    .set("Cookie", cookie)
    .send({
      title: "title text",
    })
    .expect(400);
});

it("creates a ticket with valid inputs", async () => {
  const cookie = await getCookie(1);

  let posts = await Post.find({});
  expect(posts.length).toEqual(0);

  const title = "asldkfj";

  await request(app)
    .post("/api/v1/post")
    .set("Cookie", cookie)
    .send({
      title: "test title",
      text: "test text",
    })
    .expect(201);

  posts = await Post.find({});
  expect(posts.length).toEqual(1);
  expect(posts[0].title).toEqual("test title");
  expect(posts[0].text).toEqual("test text");
});
