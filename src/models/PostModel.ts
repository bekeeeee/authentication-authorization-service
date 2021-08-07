import mongoose from "mongoose";
import { UserDoc, User } from "./UserModel";
// An interface that describes the properties
// that are required to create a new Post
interface PostAttrs {
  text: string;
  userId: UserDoc["_id"];
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
  userId: UserDoc["_id"];
}

const postSchema = new mongoose.Schema({

  text: {
    type: String,
    required: true,
  },

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

postSchema.statics.build = (attrs: PostAttrs) => {
  return new Post(attrs);
};


const Post = mongoose.model<PostDoc, PostModel>("Post", postSchema);
export { Post };
