import mongoose, { Schema } from "mongoose";
import { IUser } from "./userTypes";

const userSchema: Schema = new Schema<IUser>(
   {
      username: { type: Schema.Types.String, required: true, unique: true },
      email: { type: Schema.Types.String, required: true, unique: true },
      password: { type: Schema.Types.String, required: true },
   },
   { timestamps: true }
);

export const User = mongoose.model<IUser>("User", userSchema);
