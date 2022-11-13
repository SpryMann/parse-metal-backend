const woocommerce = require('../configs/woocommerce.config');
const { productModel } = require('../models');

class WoocommerceService {
  async getAllCategories(filters) {
    const response = await woocommerce.get(
      '/wp-json/wc/v3/products/categories',
      {
        params: {
          ...filters,
        },
      }
    );

    return response.data;
  }

  async getCategory(categoryId) {
    const response = await woocommerce.get(
      `/wp-json/wc/v3/products/categories/${categoryId}`
    );

    return response.data;
  }

  async getProductsByCategory(categoryId, perPage, page) {
    const response = await woocommerce.get('/wp-json/wc/v3/products', {
      params: {
        category: categoryId.toString(),
        per_page: parseInt(perPage),
        page: parseInt(page),
      },
    });

    return response.data;
  }

  async updateProductsByCategory(categoryId) {
    const products = await productModel.find({ categoryId });

    async function iterate(products) {
      if (!products.length) return;

      const productsBulk = [];

      for (const product of products.slice(0, 50)) {
        productsBulk.push({
          id: product.id,
          regular_price: product.price ? product.price.toString() : '',
        });
      }

      await woocommerce.post('/wp-json/wc/v3/products/batch', {
        update: productsBulk,
      });

      await new Promise((resolve) => {
        setTimeout(resolve, 1000);
      });

      iterate(products.slice(50));
    }

    iterate(products);
  }

  async getTotalPages(uri, filters) {
    const response = await woocommerce.get(uri, {
      params: {
        ...filters,
      },
    });

    return response.headers['x-wp-totalpages'];
  }
}

module.exports = new WoocommerceService();
