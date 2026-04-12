const express = require("express");
const mongoose = require("mongoose");

const app = express();
const port = 8080;
const mongoURL = "mongodb://127.0.0.1:27017/ReactQ";

mongoose
  .connect(mongoURL)
  .then(() => console.log("database is connected"))
  .catch((err) => console.log("database is not connected", err));

const Schema = mongoose.Schema;

const sales = new Schema({
  data: Schema.Types.Mixed
});

const salesdata = mongoose.model("sales", sales);
// first sales database name,  second sales schema name

app.get("/findAll", async (req, res) => {
  const allData = await salesdata.find();
  res.status(200).json(allData);
});

app.get("/findOne/:id", async (req, res) => {
  const {id} = req.params
  const oneData = await salesdata.findById(id);
  res.status(200).json(oneData)
})

app.listen(port, () => {
  console.log(`>>>>>>>>server is running on ${port}`);
});
