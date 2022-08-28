const axios = require('axios').default;
const woocommerce = axios.create({
  baseURL: process.env.OWN_SITE_BASE,
  auth: {
    username: process.env.WOOCOMMERCE_KEY,
    password: process.env.WOOCOMMERCE_SECRET,
  },
});

module.exports = woocommerce;
