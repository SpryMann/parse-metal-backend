const productService = require('../services/product.service');

class ProductController {
  async getOne(req, res, next) {
    try {
      const { id } = req.params;
      const product = await productService.getOne(id);

      return res.status(200).json(product);
    } catch (error) {
      next(error);
    }
  }

  async getAll(req, res, next) {
    try {
      const products = await productService.getAll();

      return res.status(200).json(products);
    } catch (error) {
      next(error);
    }
  }

  async getAllByCategory(req, res, next) {
    try {
      const { categoryId } = req.params;
      const products = await productService.getAllByCategory(categoryId);

      return res.status(200).json(products);
    } catch (error) {
      next(error);
    }
  }

  async upload(req, res, next) {
    try {
      const { category } = req.body;
      const { filename } = req.file;

      await productService.upload(category, filename);
      return res.json({ message: 'Файл загружен' });
    } catch (error) {
      next(error);
    }
  }

  async create(req, res, next) {
    try {
      const { title, link, targetLink, categoryId } = req.body;

      await productService.create(title, link, targetLink, categoryId);
      return res.json('Created');
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const { id } = req.params;
      const { title, link, targetLink } = req.body;

      await productService.update(id, title, link, targetLink);
      return res.json('Updated');
    } catch (error) {
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      const { id } = req.params;

      await productService.delete(id);
      return res.json('Deleted');
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new ProductController();
