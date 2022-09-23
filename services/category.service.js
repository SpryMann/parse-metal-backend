const { categoryModel, existedCategoryModel } = require('./../models');
const woocommerceService = require('./woocommerce.service');

class CategoryService {
  async getOne(id) {
    const category = await categoryModel.findById(id);
    return category;
  }

  async getExisted() {
    const categories = await existedCategoryModel.find();
    return categories;
  }

  async updateExisted(categories) {
    for (const category of categories) {
      await existedCategoryModel.findOneAndUpdate(
        { id: category.id },
        {
          percent: category.percent,
        }
      );
    }
  }

  async getAll() {
    const categories = await categoryModel.find();
    return categories;
  }

  async update() {
    const totalPages = await woocommerceService.getTotalPages(
      '/wp-json/wc/v3/products/categories',
      {
        per_page: 100,
      }
    );
    let categories = [];

    for (let page = 1; page <= totalPages; page += 1) {
      categories.push(
        ...(await woocommerceService.getAllCategories({ per_page: 100, page }))
      );
    }

    const categoriesInfo = categories.map((category) => {
      return {
        id: category.id,
        title: category.name,
        productsCount: category.count,
      };
    });

    await categoryModel.deleteMany();
    await categoryModel.insertMany(categoriesInfo);

    return categoriesInfo;
  }
}

module.exports = new CategoryService();
