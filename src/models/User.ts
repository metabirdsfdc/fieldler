import { Document, Schema, model } from "mongoose";

export interface IUser extends Document {
  fullName: string;
  email: string;
  password: string;
}

const userSchema = new Schema<IUser>(
  {
    fullName: { type: String, required: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true
    },
    password: { type: String, required: true }
  },
  { timestamps: true }
);

export default model<IUser>("User", userSchema);
