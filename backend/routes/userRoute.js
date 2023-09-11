const express = require("express");
const multer = require("multer");
const path = require("path");

const {
  signup,
  login,
  allusers,
  getUserMessages,
} = require("../controllers/userController");

const router = express.Router();

router.post("/signup", signup);

router.post("/login", login);

router.get("/allusers", allusers);

router.post("/getUserMessages", getUserMessages);

// ?image uploading
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../public/uploads/"));
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + file.originalname);
  },
});

const upload = multer({ storage });

router.use("../public", express.static("public"));

router.post("/upload", upload.single("imageUrl"), (req, res, next) => {
  if (req.file) {
    const { destination, filename } = req.file;
    const imageDestination = destination + filename;
    res.status(200).json(imageDestination);
  } else {
    res.status(400).json({ message: "No image uploaded" });
  }
});

module.exports = router;
