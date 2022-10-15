const express = require("express");
const { authUser } = require("../middlewares/auth.js");
const { createPost, getAllPosts, comment } = require("../controllers/Post");

const router = express.Router();

router.post("/createPost", authUser, createPost);
router.get("/getAllPosts", authUser, getAllPosts);
router.put("/comment", authUser, comment);

module.exports = router;
