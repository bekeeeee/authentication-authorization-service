import mongoose from "mongoose";
import { Password } from "../services/passwordHandler";

// An interface that describes the properties
// that are required to create a new User
interface UserAttrs {
  email: string;
  username: string;
  password: string;
  role?: string;
}

// An interface that describes the properties
// that a User Model has
interface UserModel extends mongoose.Model<UserDoc> {
  build(any: UserAttrs): UserDoc;
  correctPassword(
    candidatePassword: string,
    userPassword: string
  ): Promise<boolean>;
}
// An interface that describes the properties
// that a User Document has
export interface UserDoc extends mongoose.Document {
  email: string;
  password: string;
  username: string;
  role: string;
}

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  role: {
    type: String,
    default: "user",
  },
});

userSchema.pre("save", async function (next) {
  // Only run this function if password was actually modified
  if (!this.isModified("password")) return next();

  // Hash the password with cost of 12
  const hashedPassword = await Password.toHash(this.get("password"));
  this.set("password", hashedPassword);

  next();
});

userSchema.statics.build = (attrs: UserAttrs) => {
  return new User(attrs);
};

const User = mongoose.model<UserDoc, UserModel>("User", userSchema);
export { User };
