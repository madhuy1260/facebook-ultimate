const express = require("express");
const { authUser } = require("../middlewares/auth.js");
const imageUpload = require("../middlewares/imageUpload");
const { uploadImages } = require("../controllers/upload");

const router = express.Router();

router.post("/uploadImages", authUser, imageUpload, uploadImages);

module.exports = router;
