const categoryService = require('../services/category.service');

class CategoryController {
  async getOne(req, res, next) {
    try {
      const { id } = req.params;
      const category = await categoryService.getOne(id);

      return res.status(200).json(category);
    } catch (error) {
      next(error);
    }
  }

  async getExisted(req, res, next) {
    try {
      const categories = await categoryService.getExisted();

      return res.status(200).json(categories);
    } catch (error) {
      next(error);
    }
  }

  async getAll(req, res, next) {
    try {
      const categories = await categoryService.getAll();

      return res.status(200).json(categories);
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const categories = await categoryService.update();

      return res.status(200).json(categories);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new CategoryController();
