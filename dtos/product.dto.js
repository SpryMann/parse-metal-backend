module.exports = class ProductDto {
  _id;
  id;
  title;
  link;
  targetLink;
  price;
  categoryId;

  constructor(model) {
    this._id = model._id;
    this.id = model.id;
    this.title = model.title;
    this.link = model.link;
    this.targetLink = model.targetLink;
    this.price = model.price;
    this.categoryId = model.categoryId;
  }
};
