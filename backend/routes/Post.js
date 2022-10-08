const express = require("express");
const { authUser } = require("../middlewares/auth.js");
const { createPost, getAllPosts } = require("../controllers/Post");

const router = express.Router();

router.post("/createPost", authUser, createPost);
router.get("/getAllPosts", authUser, getAllPosts);

module.exports = router;
