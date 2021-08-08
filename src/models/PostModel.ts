import mongoose from "mongoose";
import { UserDoc, User } from "./UserModel";
// An interface that describes the properties
// that are required to create a new Post
interface PostAttrs {
  text: string;
  user: UserDoc["_id"];
}

// An interface that describes the properties
// that a Post Model has
interface PostModel extends mongoose.Model<PostDoc> {
  build(any: PostAttrs): PostDoc;
  // compare()
}
//mongoose.Schema.Types.ObjectId
// An interface that describes the properties
// that a Post Document has
export interface PostDoc extends mongoose.Document {
  text: string;
  user: UserDoc["_id"];
  createdAt: Date;
}

const postSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
  },

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});
postSchema.pre("find", function (next) {
  console.log("populate");
  this.populate({
    path: "user",
    select: "username _id",
  });
  next();
});
postSchema.statics.build = (attrs: PostAttrs) => {
  return new Post(attrs);
};

const Post = mongoose.model<PostDoc, PostModel>("Post", postSchema);
export { Post };
