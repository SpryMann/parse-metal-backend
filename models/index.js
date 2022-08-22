const { default: mongoose } = require('mongoose');
const userSchema = require('./user.schema');
const productSchema = require('./product.schema');

const userModel = mongoose.model('User', userSchema);
const productModel = mongoose.model('Product', productSchema);

module.exports = {
  userModel,
  productModel,
};
