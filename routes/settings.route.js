const Router = require('express').Router;
const authMiddleware = require('./../middlewares/auth.middleware');
const settingsController = require('./../controllers/settings.controller');

const router = new Router();

router.get('/', authMiddleware, settingsController.get);
router.put('/', authMiddleware, settingsController.update);

module.exports = router;
