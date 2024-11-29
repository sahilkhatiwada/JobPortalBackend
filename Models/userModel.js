import mongoose from "mongoose";
import { GenderOption, UserRoles } from "../constants/general.constant.js";

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    role: {
      type: String,
      required: true,
      enum: UserRoles,
    },
    contact: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    profileUrl: {
      type: String,
    },
    about: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      required: true,
      enum: GenderOption,
    },
    resetPasswordToken: String,
    resetPasswordExpires: Date,
  },
  {
    timestamps: true,
  }
);
const User = mongoose.model("User", userSchema);

export default User;