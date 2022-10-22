const serverState = require('../data/serverState');
const {
  getCategoryUrl,
  parseCategory,
  compareProductsInfo,
  editProductPrice,
  parseStart,
} = require('../helpers/parser');
const productService = require('../services/product.service');
const ParserDto = require('./../dtos/parser.dto');

class ParserController {
  async categoryUrl(req, res, next) {
    try {
      const { categoryId } = req.params;
      const products = await productService.getAllByCategory(categoryId);
      const categoryUrl = await getCategoryUrl(products[0].targetLink);

      return res.status(200).json({ product: products[0], categoryUrl });
    } catch (error) {
      next(error);
    }
  }

  async parse(req, res, next) {
    try {
      const { categoryId } = req.params;
      const products = await productService.getAllByCategory(categoryId);
      const categoryUrl = await getCategoryUrl(products[0].targetLink);
      const parsedProducts = await parseCategory(categoryUrl);
      const newProducts = editProductPrice(
        17,
        await compareProductsInfo(parsedProducts, categoryId)
      );

      return res
        .status(200)
        .json({ data: newProducts, items_count: parsedProducts.length });
    } catch (error) {
      next(error);
    }
  }

  async start(req, res, next) {
    try {
      const { categories } = req.body;
      parseStart(categories);

      return res.status(201).json('Started');
    } catch (error) {
      next(error);
    }
  }

  status(req, res, next) {
    try {
      const parserStatus = new ParserDto(serverState.parser);
      return res.status(200).json({ ...parserStatus });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new ParserController();
