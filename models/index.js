const { default: mongoose } = require('mongoose');
const userSchema = require('./user.schema');
const tokenSchema = require('./token.schema');
const productSchema = require('./product.schema');

const userModel = mongoose.model('User', userSchema);
const tokenModel = mongoose.model('Token', tokenSchema);
const productModel = mongoose.model('Product', productSchema);

module.exports = {
  userModel,
  tokenModel,
  productModel,
};
