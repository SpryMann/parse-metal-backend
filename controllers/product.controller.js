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

      return res
        .status(200)
        .json({ data: products, items_count: products.length });
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
}

module.exports = new ProductController();
