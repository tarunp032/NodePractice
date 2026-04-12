const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const port = 4000;
const mongoURL = "mongodb://127.0.0.1:27017/nodeQ";

app.use(express.json());
app.use(cors());

mongoose
  .connect(mongoURL)
  .then(() => {
    console.log("Database is connected");
  })
  .catch((err) => {
    console.log("Database is not connected", err);
  });

const userRouter = require("./Routes/userRoute");

app.use("/user", userRouter);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
