const express = require("express");
const { authUser } = require("../middlewares/auth.js");
const { reactPost, getReacts } = require("../controllers/react");

const router = express.Router();

router.put("/reactPost", authUser, reactPost);
router.get("/getReacts/:id", authUser, getReacts);

module.exports = router;
