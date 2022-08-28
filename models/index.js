const { default: mongoose } = require('mongoose');
const userSchema = require('./user.schema');
const tokenSchema = require('./token.schema');
const productSchema = require('./product.schema');
const categorySchema = require('./category.schema');
const existedCategorySchema = require('./existedCategory.schema');

const userModel = mongoose.model('User', userSchema);
const tokenModel = mongoose.model('Token', tokenSchema);
const productModel = mongoose.model('Product', productSchema);
const categoryModel = mongoose.model('Category', categorySchema);
const existedCategoryModel = mongoose.model(
  'Existed_category',
  existedCategorySchema
);

module.exports = {
  userModel,
  tokenModel,
  productModel,
  categoryModel,
  existedCategoryModel,
};
