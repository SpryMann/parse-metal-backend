const { Schema } = require('mongoose');

const categorySchema = new Schema({
  id: Number,
  title: String,
  productsCount: Number,
});

module.exports = categorySchema;
