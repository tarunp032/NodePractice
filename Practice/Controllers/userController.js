const user = require("../Models/userModel");
const bcrypt = require("bcrypt");

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
  const saltRounds = 10;
  console.log(`>>>>saltRounds`, saltRounds);

  const salt = bcrypt.genSaltSync(saltRounds);
  console.log(`>>>>salt`, salt);

  const hash = bcrypt.hashSync(password, salt);
  console.log(`>>>>hash`, hash);

  const data2 = { name, email, age, password: hash };
  console.log(`>>>data2>>>`, data2);
  const result = new user(data2);
  await result.save();
  return res.status(201).json(result);
};

const loginUser = async (req, res) => {
  const data = req.body;
  const { email, password } = req.body;
  if (!(email && password)) {
    return res.status(400).json({ message: "email and password is required" });
  }
  const oldUser = await user.findOne({ email });
  console.log(`>>>oldUser>>>`, oldUser);
  if (!oldUser) {
    return res.status(400).json({ message: "user not exists, please signup" });
  }

  const match = await bcrypt.compare(password, oldUser.password);
  console.log(`>>>match>>>`, match);
  if (match) {
    return res.status(200).json({ message: "Login Successfully" });
  } else {
    return res.status(200).json({ message: "Wrong password" });
  }
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
  loginUser,
  findAll,
  findOne,
  findOneByQuery,
  updateData,
  deleteData,
};
