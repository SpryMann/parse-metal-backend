const Router = require('express').Router;
const userRouter = require('./user.route');
const productRouter = require('./product.route');
const categoryRouter = require('./category.route');
const parserRouter = require('./parser.route');
const tableRouter = require('./table.route');

const router = new Router();

router.use('/user', userRouter);
router.use('/product', productRouter);
router.use('/category', categoryRouter);
router.use('/parser', parserRouter);
router.use('/table', tableRouter);

module.exports = router;
