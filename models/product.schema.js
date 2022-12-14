const { Schema } = require('mongoose');

const productSchema = new Schema({
  id: Number,
  title: String,
  link: String,
  targetLink: String,
  price: Number,
  categoryId: Number,
});

module.exports = productSchema;
