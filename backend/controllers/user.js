const {
  validateEmail,
  validateLength,
  validateUsername,
} = require("../helpers/validation");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { generateToken } = require("../helpers/tokens");
const { sendVerificationEmail, sendResetCode } = require("../helpers/mailer");
const Code = require("../models/Code");
const generateCode = require("../helpers/generateCode");
// const { request } = require("gaxios");

exports.register = async (req, res) => {
  try {
    const {
      first_name,
      last_name,
      email,
      password,
      username,
      bYear,
      bMonth,
      bDay,
      gender,
    } = req.body;

    if (!validateEmail(email)) {
      return res.status(400).json({
        message: "Invalid email address",
      });
    }
    // console.log(validateEmail(email));

    const check = await User.findOne({ email });
    if (check) {
      return res.status(400).json({
        message:
          "this email already exists, try with a different email address",
      });
    }

    if (!validateLength(first_name, 3, 30)) {
      return res.status(400).json({
        message: "first_name must be at least 3-30 characters long",
      });
    }

    // console.log(validateLength(first_name, 3, 30));

    if (!validateLength(last_name, 3, 30)) {
      return res.status(400).json({
        message: "last_name must be at least 3-30 characters long",
      });
    }

    if (!validateLength(password, 6, 40)) {
      return res.status(400).json({
        message: "password must be at least 6 characters long",
      });
    }

    // console.log(validateLength(password, 6, 40));

    const cryptedPassword = await bcrypt.hash(password, 12);
    // console.log(cryptedPassword);
    let tempUsername = first_name + last_name;
    let newUsername = await validateUsername(tempUsername);
    // console.log(newUsername);

    const user = await new User({
      first_name,
      last_name,
      email,
      password: cryptedPassword,
      username: newUsername,
      bYear,
      bMonth,
      bDay,
      gender,
    }).save();
    // res.json(user);
    const emailVerificationToken = generateToken(
      { id: user._id.toString() },
      "30m"
    );

    const url = `${process.env.BASE_URL}/activate/${emailVerificationToken}`;
    sendVerificationEmail(user.email, user.first_name, url);
    const token = generateToken({ id: user._id.toString() }, "7d");
    res.send({
      id: user._id,
      username: user.username,
      picture: user.picture,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      token: token,
      verified: user.verified,
      message: "Register Success, Please activate your email to start",
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.activateAccount = async (req, res) => {
  try {
    const validUser = req.user.id;
    const { token } = req.body;
    const user = jwt.verify(token, process.env.TOKEN_SECRET_KEY);
    const check = await User.findById(user.id);

    if (validUser !== user.id) {
      return res.status(400).json({
        message: "You dont have the authorization to complete this operation",
      });
    }

    if (check.verified == true) {
      return res
        .status(400)
        .json({ message: "This email is already activated" });
    } else {
      await User.findByIdAndUpdate(user.id, { verified: true });
      return res
        .status(200)
        .json({ message: "Account has been activated succesfully" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        message: "The email address you entered is not connected to an account",
      });
    }
    const check = await bcrypt.compare(password, user.password);
    if (!check) {
      return res.status(400).json({
        message: "Invalid Credentials, Please try again",
      });
    }
    const token = generateToken({ id: user._id.toString() }, "7d");
    res.send({
      id: user._id,
      username: user.username,
      picture: user.picture,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      token: token,
      verified: user.verified,
      message: "Login Successfully",
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.sendVerification = async (req, res) => {
  try {
    const id = req.user.id;
    const user = await User.findById(id);
    if (user.verified === true) {
      return res
        .status(400)
        .json({ message: "This account is already activated" });
    }
    const emailVerificationToken = generateToken(
      { id: user._id.toString() },
      "30m"
    );

    const url = `${process.env.BASE_URL}/activate/${emailVerificationToken}`;
    sendVerificationEmail(user.email, user.first_name, url);
    return res.status(200).json({
      message: "Email Verification Link has been sent to your email.",
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.findUser = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email }).select("-password");
    if (!user) {
      return res.status(400).json({ message: "Account does not exist" });
    }
    return res.status(200).json({ email: user.email, picture: user.picture });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.sendResetPasswordCode = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email }).select("-password");
    await Code.findOneAndRemove({ user: user._id });
    const code = generateCode(5);
    const savedCode = await new Code({ code, user: user._id }).save();
    sendResetCode(user.email, user.first_name, code);
    return res
      .status(200)
      .json({ message: "Email Reset Code has been sent to your email" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.validateResetCode = async (req, res) => {
  try {
    const { email, code } = req.body;
    const user = await User.findOne({ email });
    const Dbcode = await Code.findOne({ user: user._id });
    console.log(Dbcode);
    if (Dbcode.code !== code) {
      return res.status(400).json({ message: "Verification Code is Wrong ." });
    }
    return res.status(200).json({ message: "Okay" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.changePassword = async (req, res) => {
  const { email, password } = req.body;

  const cryptedPassword = await bcrypt.hash(password, 12);
  await User.findOneAndUpdate({ email }, { password: cryptedPassword });
  return res.status(200).json({ message: "Okay" });
};

exports.getProfile = async (req, res) => {
  try {
    const { username } = req.params;
    const profile = await User.findOne({ username }).select("-password");
    if (profile.length === 0) {
      res.json({ ok: false });
    } else {
      res.send(profile);
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
