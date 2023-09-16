const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const validator = require("validator");

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    imageUrl: {
      type: String,
    },
  },
  { timestamps: true }
);

UserSchema.statics.signup = async function (
  username,
  email,
  password,
  imageUrl
) {
  if (!username || !email || !password) {
    throw Error("All fields must be filled");
  }
  if (!validator.isStrongPassword) {
    throw Error("The password is not strong enough");
  }
  if (!validator.isEmail) {
    throw Error("The email is not valid");
  }

  const usernameExists = await this.findOne({ username });
  if (usernameExists) {
    throw Error("User username already exists");
  }

  const emailExists = await this.findOne({ email });
  if (emailExists) {
    throw Error("User mail already exists");
  }

  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);

  const newUser = await this.create({
    username,
    email,
    password: hash,
    imageUrl,
  });
  return newUser;
};

UserSchema.statics.login = async function (email, password) {
  if (!email || !password) {
    throw Error("Both fields must be filled");
  }
  const user = await this.findOne({ email });
  if (!user) {
    throw Error("Email doesn't exist");
  }
  const isRightPassword = await bcrypt.compare(password, user.password);
  if (!isRightPassword) {
    throw Error("Wrong password");
  }
  return user;
};

module.exports = mongoose.model("user", UserSchema);
