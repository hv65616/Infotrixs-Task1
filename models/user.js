const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const validator = require("validator");
// schema for user account create
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "A user must have a name"],
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    validate: [validator.isEmail, "Please provide a valid email"],
  },
  password: {
    type: String,
    required: [true, "A user must have a password"],
  },
  passwordConfirm: {
    type: String,
    required: [true, "Please confirm your password"],
    validate: {
      validator: function (el) {
        return el === this.password;
      },
      message: "Password and Confirm Password is not same",
    },
    active: {
      type: Boolean,
      default: true,
      select: false,
    },
  },
});
// bcypt the password before saving it into database
userSchema.pre("save", async function (next) {
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});
// check whether the password entered and password stored are same or not
userSchema.methods.correctPassword = async function (
  candidatepassword,
  userpassword
) {
  return await bcrypt.compare(candidatepassword, userpassword);
};
const Task1User = mongoose.model("Task1User", userSchema);
module.exports = Task1User;
