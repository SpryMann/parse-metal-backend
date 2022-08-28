const Router = require('express').Router;
const tableController = require('./../controllers/table.controller');
const router = new Router();

router.get('/', tableController.get);

module.exports = router;
