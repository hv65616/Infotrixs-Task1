const mongoose = require("mongoose");
const mongoURI = "mongodb://localhost:27017/task1";
const connecttomongo = () => {
  mongoose
    .connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then((con) => {
      console.log("Connected to Database");
    });
};
module.exports = connecttomongo;
