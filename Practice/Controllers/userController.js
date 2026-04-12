const user = require("../Models/userModel");

const signup = async (req, res) => {
  const data = req.body;
  const { email, name, age, password } = req.body;
  if (!(name && email && password)) {
    return res
      .status(400)
      .json({ message: "name, email and password is required" });
  }
  const oldUser = await user.findOne({ email });
  if (oldUser) {
    return res.status(400).json({ message: "user already exists" });
  }
  const result = new user(data);
  await result.save();
  return res.status(201).json(result);
};

const findAll = async (req, res) => {
  const allUser = await user.find();
  console.log(`>>>>allUser`, allUser);
  res.status(200).json(allUser);
};

const findOne = async (req, res) => {
  const { id } = req.params;
  const oneUser = await user.findById(id);
  console.log(`>>>oneUser`, oneUser);
  res.status(200).json(oneUser);
};

const findOneByQuery = async (req, res) => {
  console.log(`>>>>req`, req.query.id);
  const result = await user.findById(req.query.id);
  res.status(200).json(result);
};

const updateData = async (req, res) => {
  const id = req.body._id;
  const data = req.body;
  const result = await user.findByIdAndUpdate(id, data, { new: true });
  res.status(200).json(result);
};

const deleteData = async (req, res) => {
  const { id } = req.params;
  const result = await user.findByIdAndDelete(id);
  res.status(200).json(result);
};

module.exports = {
  signup,
  findAll,
  findOne,
  findOneByQuery,
  updateData,
  deleteData,
};
