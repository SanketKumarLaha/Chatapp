const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const cloudinary = require("../assets/cloudinary");
const Messages = require("../models/messagesModel");

const createToken = (_id) => {
  return jwt.sign({ _id }, process.env.SECRET, { expiresIn: "1hr" });
};

const signup = async (req, res) => {
  const { username, email, password, imageUrl } = req.body;
  console.log("imageUrl", imageUrl);
  try {
    let imageResult = "";
    if (imageUrl) {
      imageResult = await cloudinary.v2.uploader.upload(
        imageUrl,
        (error, result) => console.log(result)
      );
    }
    console.log("imageResult", imageResult);
    const newUser = await User.signup(
      username,
      email,
      password,
      imageResult === "" ? "" : imageResult.secure_url
    );
    const token = createToken(newUser._id);
    res.status(200).json({ newUser, token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const newUser = await User.login(email, password);
    const token = createToken(newUser._id);
    res.status(200).json({ newUser, token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const allusers = async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).json(users);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getUserMessages = async (req, res) => {
  const { id } = req.body;
  console.log(id);
  try {
    const response = await Messages.getUserMessages(id);
    res.status(200).json(response);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = { signup, login, allusers, getUserMessages };
