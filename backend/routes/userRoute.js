const express = require("express");
const path = require("path");

const {
  signup,
  login,
  allusers,
  getUserMessages,
  updateUserInfo,
} = require("../controllers/userController");

const router = express.Router();

router.post("/signup", signup);

router.post("/login", login);

router.get("/allusers", allusers);

router.post("/getUserMessages", getUserMessages);

router.put("/updateUserInfo", updateUserInfo);

module.exports = router;
