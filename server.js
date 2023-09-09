const app = require("./app");
const connecttomongo = require("./db");
connecttomongo();
process.on("uncaughtException", (err) => {
  console.log(err.name, err.message);
  console.log("UNCAUGHT EXCEPTION!!!! SHUTTING DOWN......");
  server.close(() => {
    process.exit(1);
  });
});
const server = app.listen(3000, () => {
  console.log("Server is listening on port 3000");
});
process.on("unhandledRejection", (err) => {
  console.log(err.name, err.message);
  console.log("UNHANDLED REJECTION!!!! SHUTTING DOWN......");
  server.close(() => {
    process.exit(1);
  });
});
