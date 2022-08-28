const tableService = require('../services/table.service');

class TableController {
  async get(req, res, next) {
    try {
      const table = await tableService.getTable();
      res.send(table);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new TableController();
