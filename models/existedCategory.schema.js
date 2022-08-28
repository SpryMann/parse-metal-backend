const { Schema } = require('mongoose');

const existedCategorySchema = new Schema({
  id: Number,
  title: String,
  productsCount: Number,
  percent: { type: Number, default: 10 },
});

module.exports = existedCategorySchema;
