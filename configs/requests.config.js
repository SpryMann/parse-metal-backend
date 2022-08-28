const axios = require('axios').default;
const mc = axios.create({
  baseURL: process.env.TARGET_SITE_BASE,
});

module.exports = mc;
