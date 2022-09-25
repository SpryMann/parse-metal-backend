const axios = require('axios').default;
const https = require('https');
const mc = axios.create({
  baseURL: process.env.TARGET_SITE_BASE,
  timeout: 60000,
  httpsAgent: new https.Agent({ keepAlive: true }),
});

module.exports = mc;
