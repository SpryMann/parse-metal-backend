const Router = require('express').Router;
const categoryController = require('./../controllers/category.controller');
const router = new Router();

router.get('/retrieve', categoryController.getAll);
router.get('/retrieve/existed', categoryController.getExisted);
router.get('/retrieve/:id', categoryController.getOne);
router.get('/update', categoryController.update);
router.post('/update', categoryController.updateExisted);

module.exports = router;
