const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const port = 8080;
const mongoURL = "mongodb://127.0.0.1:27017/task4";

app.use(cors());
app.use(express.json());

mongoose
  .connect(mongoURL)
  .then(() => console.log("Database is connected"))
  .catch((err) => console.log("Database is not connected", err));

const productRouter = require("./Routes/productRoute");
const cartRouter = require("./Routes/cartRoute");
const userRouter = require("./Routes/userRoute");
app.use("/product", productRouter);
app.use("/cart", cartRouter);
app.use("/user", userRouter);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
