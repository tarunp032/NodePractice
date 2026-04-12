const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
  name: {
    type: "String",
    required: true,
  },
  email: {
    type: "String",
    required: true,
    unique: true,
  },
  password: {
    type: "String",
    required: true,
  },
  age: {
    type: "Number",
    min: 18,
    max: 32,
    required: false,
  },
  status: {
    type : 'String',
    required:true,
    default:"Active"
  }
},
{
timestamps:true,
versionKey:false
}
);

module.exports = mongoose.model("user", userSchema);