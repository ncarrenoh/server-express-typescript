const mongo = require('mongoose');
const { Schema } = mongo;

const UserSchema = new Schema({
  name: String,
  password: { type: String, required: true },
  email: { 
    type: String,
    required: true,
    unique: true,
  }
})

module.exports = mongo.model('User', UserSchema);