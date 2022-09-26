const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const userSchema = mongoose.Schema(
  {
    first_name: {
      type: String,
      required: [true, "firstName is required"],
      trim: true,
      text: true,
    },
    last_name: {
      type: String,
      required: [true, "lastName is required"],
      trim: true,
      text: true,
    },
    username: {
      type: String,
      required: [true, "userName is required"],
      trim: true,
      text: true,
      unique: true,
    },
    email: {
      type: String,
      required: [true, "email is required"],
      trim: true,
      unique: true,
    },
    password: {
      type: String,
      required: [true, "password is required"],
    },
    picture: {
      type: String,
      default:
        "https://c8.alamy.com/comp/2C5XKN9/profil-picture-icon-vector-isolated-on-white-background-2C5XKN9.jpg",
    },
    cover: { type: String, trim: true },
    gender: { type: String, required: true, enum: ["male", "female"] },
    bYear: { type: Number, required: true, trim: true },
    bMonth: { type: Number, required: true, trim: true },
    bDay: { type: Number, required: true, trim: true },
    verified: { type: Boolean, default: false },
    friends: { type: Array, default: [] },
    following: { type: Array, default: [] },
    followers: { type: Array, default: [] },
    requests: { type: Array, default: [] },
    search: [
      {
        user: {
          type: ObjectId,
          ref: "User",
        },
      },
    ],
    details: {
      bio: { type: String },
      otherName: { type: String },
      job: { type: String },
      workplace: { type: String },
      highSchool: { type: String },
      college: { type: String },
      currentCity: { type: String },
      homeTown: { type: String },
      relationship: {
        type: String,
        enum: ["Single", "In a Relationship", "Married", "Divorced"],
      },
      instagram: { type: String },
    },
    savedPosts: [
      {
        post: { type: ObjectId, ref: "Post" },
        savedAt: { type: Date, default: new Date() },
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);