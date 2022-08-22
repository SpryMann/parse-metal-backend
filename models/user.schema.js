const { Schema } = require('mongoose');

const userSchema = new Schema({
  firstName: String,
  username: String,
  password: String,
});

module.exports = userSchema;
