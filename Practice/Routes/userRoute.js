const express = require("express");

const router = express.Router();
const {
  signup,
  loginUser,
  findAll,
  findOne,
  findOneByQuery,
  updateData,
  deleteData,
} = require("../Controllers/userController");
router.post("/sign", signup);
router.post("/login",loginUser)
router.get("/findusers", findAll);
router.get("/findsingle/:id", findOne);
router.get("/findOneByQuery", findOneByQuery);
router.patch("/updateData", updateData);
router.delete("/deleteData/:id", deleteData);

module.exports = router;
