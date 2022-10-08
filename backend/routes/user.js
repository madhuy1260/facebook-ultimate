const express = require("express");
const { authUser } = require("../middlewares/auth.js");

const {
  register,
  activateAccount,
  login,
  findUser,
  sendVerification,
  sendResetPasswordCode,
  validateResetCode,
  changePassword,
} = require("../controllers/user");

const router = express.Router();

router.post("/register", register);
router.post("/activate", authUser, activateAccount);
router.post("/login", login);
router.post("/sendVerification", authUser, sendVerification);
router.post("/findUser", findUser);
router.post("/sendResetPasswordCode", sendResetPasswordCode);
router.post("/validateResetCode", validateResetCode);
router.post("/changePassword", changePassword);

module.exports = router;
