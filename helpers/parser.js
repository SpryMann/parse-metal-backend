const mc = require('./../configs/requests.config');
const fakeUa = require('fake-useragent');
const { JSDOM } = require('jsdom');
const productService = require('../services/product.service');
const woocommerceService = require('../services/woocommerce.service');
const categoryService = require('../services/category.service');
const { productModel } = require('../models');
const ProductDto = require('./../dtos/product.dto');
const serverState = require('../data/serverState');

async function getCategoryUrl(categoryId) {
  try {
    const productUrl = (await productModel.findOne({ categoryId })).targetLink;
    const response = await mc.get(productUrl.split('https://mc.ru')[1], {
      headers: {
        'User-Agent': fakeUa(),
      },
    });
    const document = new JSDOM(response.data).window.document;

    if (productUrl === response.request.res.responseUrl) {
      return [...document.querySelectorAll('.UrlSpeed > span > a')]
        .slice(-1)[0]
        .href.trim();
    } else {
      return response.request.res.responseUrl;
    }
  } catch (error) {
    throw error;
  }
}

async function getCategoryTotalPages(categoryUrl) {
  try {
    const { data: html } = await mc.get(`${categoryUrl}/Page100/1`, {
      headers: {
        'User-Agent': fakeUa(),
      },
    });
    const document = new JSDOM(html).window.document;
    const catalogPaginator = document.querySelector('.catalogPaginator');
    const paginationUl = catalogPaginator
      ? catalogPaginator.querySelector('ul')
      : null;

    if (!paginationUl) {
      return 1;
    }

    return parseInt(
      paginationUl.querySelector('li:last-of-type').textContent.trim()
    );
  } catch (error) {
    throw error;
  }
}

async function parseCategory(categoryUrl) {
  try {
    const totalPages = await getCategoryTotalPages(categoryUrl);
    const productsInfo = [];

    for (const page of Array.from(Array(totalPages + 1).keys()).slice(1)) {
      const { data: html } = await mc.get(`${categoryUrl}/Page100/${page}`, {
        headers: {
          'User-Agent': fakeUa(),
        },
      });

      productsInfo.push(...readCategory(html));
    }

    return productsInfo;
  } catch (error) {
    throw error;
  }
}

function readCategory(html) {
  try {
    const document = new JSDOM(html).window.document;
    const table = document.querySelector('#tab_main1');
    const tableColumns = [
      'name',
      'url',
      'size',
      'brand',
      'length',
      'city',
      'price',
    ];

    const tableBody = table.querySelector('tbody');
    const tableBodyItems = [...tableBody.querySelectorAll('tr')];
    const productsInfo = [];

    for (const tableBodyItem of tableBodyItems) {
      const productColumns = [...tableBodyItem.querySelectorAll('td')];
      const productTitle = productColumns[0]
        .querySelectorAll('a')[1]
        .textContent.trim();
      const productLink = `${process.env.TARGET_SITE_BASE}${productColumns[0]
        .querySelectorAll('a')[1]
        .href.trim()}`;
      const productSize = productColumns[1].textContent.trim();
      const productBrand = productColumns[2].textContent.trim();
      const productLength = productColumns[3].textContent.trim();
      const productCity = productColumns[4].textContent.trim();
      const productPrice = parseInt(
        productColumns
          .find((item) => item.getAttribute('data-price-val') === '2')
          .textContent.trim()
          .split('')
          .filter((item) => /\d/.test(item))
          .join('')
      );
      const productInfoArray = [
        productTitle,
        productLink,
        productSize,
        productBrand,
        productLength,
        productCity,
        productPrice,
      ];
      const productInfoObject = {};

      tableColumns.forEach((item, index) => {
        productInfoObject[item] = productInfoArray[index];
      });
      productsInfo.push(productInfoObject);
    }

    return productsInfo;
  } catch (error) {
    throw error;
  }
}

async function parseProductPrice(productUrl) {
  try {
    const { data: html } = await mc.get(productUrl, {
      headers: {
        'User-Agent': fakeUa(),
      },
    });
    const document = new JSDOM(html).window.document;
    let price = [...document.querySelectorAll('.price')]
      .find((item) => item.textContent.trim() !== 'заказ')
      .textContent.trim();
    price = parseInt(
      price
        .split('')
        .filter((item) => /\d/.test(item))
        .join('')
    );

    return price;
  } catch (error) {
    throw error;
  }
}

async function compareProductsInfo(parsedProducts, categoryId) {
  try {
    const products = (await productService.getAllByCategory(categoryId)).map(
      (product) => new ProductDto(product)
    );
    const newProducts = [];

    for (const product of products) {
      const newPrice =
        parsedProducts.find((item) => item.url === product.targetLink) &&
        parsedProducts.find((item) => item.url === product.targetLink).price;

      newProducts.push({
        ...product,
        newPrice: newPrice || 0,
      });
    }

    return newProducts;
  } catch (error) {
    throw error;
  }
}

function editProductsPrices(additionPercent, products) {
  try {
    return products.map((item) => {
      return {
        ...item,
        editedPrice: parseInt(
          item.newPrice * (parseInt(additionPercent) / 100 + 1)
        ),
      };
    });
  } catch (error) {
    throw error;
  }
}

async function parseStart(categories) {
  /*
    category: {
      name: string,
      id: number,
      percent: number
    }
  */
  try {
    serverState.parser.logs = [];
    serverState.parser.isRunning = true;
    serverState.parser.completed = false;

    for (const category of categories) {
      if (!(await productModel.find({ categoryId: category.id })).length) {
        continue;
      }

      serverState.parser.logs.push({
        categoryName: category.name,
        completed: false,
        success: false,
      });

      const categoryUrl = await getCategoryUrl(category.id);
      const parsedCategoryProducts = await parseCategory(categoryUrl);
      const parsedProductsWithPrices = await compareProductsInfo(
        parsedCategoryProducts,
        category.id
      );
      const newProducts = editProductsPrices(
        category.percent,
        parsedProductsWithPrices
      );

      for (const newProduct of newProducts) {
        await productModel.findByIdAndUpdate(newProduct._id, {
          price: parseInt(newProduct.editedPrice),
        });
      }

      await woocommerceService.updateProductsByCategory(category.id);
      await new Promise((resolve) => {
        setTimeout(resolve, 1000);
      });

      serverState.parser.logs[
        serverState.parser.logs.length - 1
      ].completed = true;
      serverState.parser.logs[
        serverState.parser.logs.length - 1
      ].success = true;
    }

    serverState.parser.isRunning = false;
    serverState.parser.completed = true;
    serverState.parser.errors = [];
    serverState.parser.lastParsingDate = Date.now();
  } catch (error) {
    console.log(serverState.parser.logs);
    serverState.parser.logs[
      serverState.parser.logs.length - 1
    ].completed = true;
    serverState.parser.logs[serverState.parser.logs.length - 1].success = false;
    serverState.parser.isRunning = false;
    serverState.parser.completed = true;
    serverState.parser.errors.push(error);
    throw error;
  }
}

async function scheduleParsing() {
  try {
    if (serverState.settings.autoParsing.isEnabled) {
      if (serverState.parser.timeoutId) {
        clearTimeout(serverState.parser.timeoutId);
        serverState.parser.timeoutId = null;
      }

      let delay = 0;
      const timeMorning = serverState.settings.autoParsing.timeMorning;
      const timeEvening = serverState.settings.autoParsing.timeEvening;

      if (new Date().getHours() < timeMorning) {
        delay = new Date().setHours(timeMorning, 0, 0, 0) - Date.now();
      } else if (
        new Date().getHours() >= timeMorning &&
        new Date().getHours() < timeEvening
      ) {
        delay = new Date().setHours(timeEvening, 0, 0, 0) - Date.now();
      } else if (new Date().getHours() >= timeEvening) {
        delay =
          new Date(new Date().setDate(new Date().getDate() + 1)).setHours(
            timeMorning,
            0,
            0,
            0
          ) - Date.now();
      }

      const categories = (await categoryService.getExisted()).map(
        (category) => ({
          name: category.title,
          id: category.id,
          percent: category.percent,
        })
      );

      console.log(
        `Next parsing at: ${new Date(Date.now() + delay).toLocaleString()}`
      );

      serverState.parser.timeoutId = setTimeout(() => {
        parseStart(categories);
        scheduleParsing();
      }, delay);
    } else {
      if (serverState.parser.timeoutId) {
        clearTimeout(serverState.parser.timeoutId);
        serverState.parser.timeoutId = null;
      }
    }
  } catch (error) {
    throw error;
  }
}

module.exports = {
  getCategoryUrl,
  parseCategory,
  compareProductsInfo,
  editProductsPrices,
  parseStart,
  scheduleParsing,
};
