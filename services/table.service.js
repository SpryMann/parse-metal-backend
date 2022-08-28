const util = require('util');
const needle = require('needle');

const needleGet = util.promisify(needle.get);

class TableService {
  async getTable() {
    const response = await needleGet('https://mc.ru/prices/sortovojprokat.htm');
    return response.body;
  }
}

module.exports = new TableService();
