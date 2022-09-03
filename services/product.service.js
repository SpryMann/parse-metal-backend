const fs = require('fs');
const path = require('path');
const { parse } = require('csv-parse');
const woocommerceService = require('./woocommerce.service');
const {
  productModel,
  existedCategoryModel,
  categoryModel,
} = require('../models');

class ProductService {
  async getOne(id) {
    const product = await productModel.findById(id);

    return product;
  }

  async getAll() {
    const products = await productModel.find();

    return products;
  }

  async getAllByCategory(categoryId) {
    const products = await productModel.find({
      categoryId: parseInt(categoryId),
    });

    return products;
  }

  async upload(category, filename) {
    let productsInfo = [];

    const foundCategory = await categoryModel.findOne({
      id: parseInt(category),
    });
    await existedCategoryModel.updateOne(
      { id: parseInt(category) },
      {
        id: foundCategory.id,
        title: foundCategory.title,
        productsCount: foundCategory.productsCount,
      },
      {
        upsert: true,
      }
    );

    fs.createReadStream(path.join(path.resolve(), 'uploads', filename))
      .pipe(parse({ delimiter: ',', from_line: 2 }))
      .on('data', (row) => {
        productsInfo.push({
          link: row[0],
          targetLink: row[1],
          categoryId: parseInt(category),
        });
      })
      .on('error', (error) => {
        throw error;
      });

    const categoryProductsCount = (
      await woocommerceService.getCategory(category)
    ).count;
    const categoryProducts = [];

    for (const page of Array.from(
      Array(Math.ceil(categoryProductsCount / 100) + 1).keys()
    ).slice(1)) {
      categoryProducts.push(
        ...(await woocommerceService.getProductsByCategory(category, 100, page))
      );
    }

    productsInfo = productsInfo.map((productItem) => {
      const productInfo = categoryProducts.find(
        (item) => item.permalink === productItem.link
      );

      return {
        id: productInfo.id,
        title: productInfo.name,
        link: productInfo.permalink,
        targetLink: productItem.targetLink,
        price: parseInt(productInfo.price) || 0,
        categoryId: productItem.categoryId,
      };
    });

    await productModel.deleteMany({ categoryId: parseInt(category) });
    await productModel.insertMany(productsInfo);

    const newProducts = await productModel.find({
      categoryId: parseInt(category),
    });

    await existedCategoryModel.updateOne(
      { id: parseInt(category) },
      {
        productsCount: newProducts.length,
      }
    );
  }

  async create(
    productTitle,
    productLink,
    productTargetLink,
    productCategoryId
  ) {
    const foundCategory = await categoryModel.findOne({
      id: parseInt(productCategoryId),
    });
    await existedCategoryModel.updateOne(
      { id: parseInt(productCategoryId) },
      {
        id: foundCategory.id,
        title: foundCategory.title,
        productsCount: foundCategory.productsCount,
      },
      {
        upsert: true,
      }
    );

    const categoryProductsCount = (
      await woocommerceService.getCategory(productCategoryId)
    ).count;
    const categoryProducts = [];

    for (const page of Array.from(
      Array(Math.ceil(categoryProductsCount / 100) + 1).keys()
    ).slice(1)) {
      categoryProducts.push(
        ...(await woocommerceService.getProductsByCategory(
          productCategoryId,
          100,
          page
        ))
      );
    }

    const foundProduct = categoryProducts.find(
      (item) => item.permalink === productLink
    );

    if (foundProduct) {
      await productModel.updateOne(
        { link: foundProduct.permalink },
        {
          id: foundProduct.id,
          title: productTitle,
          link: foundProduct.permalink,
          targetLink: productTargetLink,
          price: parseInt(foundProduct.price) || 0,
          categoryId: productCategoryId,
        },
        {
          upsert: true,
        }
      );
    }

    const newProducts = await productModel.find({
      categoryId: parseInt(productCategoryId),
    });

    await existedCategoryModel.updateOne(
      { id: parseInt(productCategoryId) },
      {
        productsCount: newProducts.length,
      }
    );
  }

  async update(productId, productTitle, productLink, productTargetLink) {
    await productModel.findOneAndUpdate(
      { id: productId },
      {
        title: productTitle,
        link: productLink,
        targetLink: productTargetLink,
      }
    );
  }

  async delete(productId) {
    const product = await productModel.findOne({ id: productId });
    const productCategory = product.categoryId;
    await product.delete();
    const categoryProductsLeft = await productModel.find({
      categoryId: productCategory,
    });

    if (!categoryProductsLeft.length) {
      await existedCategoryModel.findOneAndDelete({ id: productCategory });
    } else {
      await existedCategoryModel.findOneAndUpdate(
        { id: productCategory },
        { productsCount: categoryProductsLeft.length }
      );
    }
  }
}

module.exports = new ProductService();
