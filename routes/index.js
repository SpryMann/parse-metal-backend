const Router = require('express').Router;
const userRouter = require('./user.route');

const router = new Router();

router.use('/user', userRouter);

module.exports = router;
