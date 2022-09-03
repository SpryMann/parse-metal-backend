const Router = require('express').Router;
const upload = require('./../configs/multer.config');
const productController = require('./../controllers/product.controller');
const router = new Router();

router.get('/retrieve', productController.getAll);
router.get(
  '/retrieve/category/:categoryId',
  productController.getAllByCategory
);
router.get('/retrieve/:id', productController.getOne);
router.post('/upload', upload.single('excelFile'), productController.upload);
router.post('/', productController.create);
router.put('/:id', productController.update);
router.delete('/:id', productController.delete);

module.exports = router;
