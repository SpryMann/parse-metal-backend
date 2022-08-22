const { Schema } = require('mongoose');

const tokenSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  refresh: { type: String, required: true },
});

module.exports = tokenSchema;
