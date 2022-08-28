const Router = require('express').Router;
const parserController = require('./../controllers/parser.controller');
const router = new Router();

router.get('/category_url/:categoryId', parserController.categoryUrl);
router.get('/category/:categoryId', parserController.parse);
router.post('/start', parserController.start);
router.get('/status', parserController.status);

module.exports = router;
