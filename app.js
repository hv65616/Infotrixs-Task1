const express = require("express");
const app = express();
const bodyparser = require("body-parser");
const User = require("./models/user");
const apperror = require("./utils/appError");
const catchasync = require("./utils/catchAsync");
const jwt = require("jsonwebtoken");
const path = require("path");
app.use(express.json());
app.use(bodyparser.urlencoded({ extended: true }));
const staticpath = path.join(__dirname, "./frontend");
app.use(express.static(staticpath));
app.get("/signup", (req, res) => {
  res.sendFile(__dirname + "/frontend/signup.html");
});
app.post(
  "/signup",
  catchasync(async (req, res) => {
    const newuser = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      passwordConfirm: req.body.passwordConfirm,
    });
    const jwtsecret = "my-secret-is-only-my-secret-it-is-non-your-secret";
    const jwtexpire = "12h";
    const payload = { id: newuser._id };
    const token = jwt.sign(payload, jwtsecret, { expiresIn: jwtexpire });
    // res.status(201).json({
    //   status: "Suceess",
    //   token: token,
    //   message: "User is successfully created",
    //   user: newuser,
    // });
    res.redirect("/signup");
  })
);
app.get("/login", (req, res) => {
  res.sendFile(__dirname + "/frontend/login.html");
});
app.post(
  "/login",
  catchasync(async (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    if (!email || !password) {
      return next(new apperror("Please enter your email or password", 400));
    }
    const user = await User.findOne({ email }).select("+password");
    const correctpassword = await user.correctPassword(
      password,
      user.password
    );
    if (!user || !correctpassword) {
      return next(new apperror("Incorrect emil or password", 401));
    }
    const jwtsecret = "my-secret-is-only-my-secret-it-is-non-your-secret";
    const jwtexpire = "12h";
    const payload = { id: user._id };
    const token = jwt.sign(payload, jwtsecret, { expiresIn: jwtexpire });
    // res.status(200).json({
    //   stauts: "success",
    //   token: token,
    //   message: "User is successfully loggedin !!!!",
    // });
    res.redirect("/login");
  })
);
module.exports = app;
