const express = require("express");
const { authUser } = require("../middlewares/auth.js");
const imageUpload = require("../middlewares/imageUpload");
const { uploadImages, listImages } = require("../controllers/upload");

const router = express.Router();

router.post("/uploadImages", authUser, imageUpload, uploadImages);
router.post("/listImages", authUser, listImages);

module.exports = router;
