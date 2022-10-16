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
  getProfile,
  updateProfilePicture,
  updateCover,
  updateDetails,
  addFriend,
  cancelRequest,
  follow,
  unfollow,
  acceptRequest,
  unfriend,
  deleteRequest,
  search,
  addToSearchHistory,
  getSearchHistory,
  removeFromSearch,
  getFriendsPageInfos,
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
router.get("/getProfile/:username", authUser, getProfile);
router.patch("/updateProfilePicture", authUser, updateProfilePicture);
router.patch("/updateCover", authUser, updateCover);
router.patch("/updateDetails", authUser, updateDetails);
router.patch("/addFriend/:id", authUser, addFriend);
router.patch("/cancelRequest/:id", authUser, cancelRequest);
router.patch("/follow/:id", authUser, follow);
router.patch("/unfollow/:id", authUser, unfollow);
router.patch("/acceptRequest/:id", authUser, acceptRequest);
router.patch("/unfriend/:id", authUser, unfriend);
router.patch("/deleteRequest/:id", authUser, deleteRequest);
router.post("/search/:searchTerm", authUser, search);
router.put("/addToSearchHistory", authUser, addToSearchHistory);
router.get("/getSearchHistory", authUser, getSearchHistory);
router.put("/removeFromSearch", authUser, removeFromSearch);
router.get("/getFriendsPageInfos", authUser, getFriendsPageInfos);

module.exports = router;
