const userService = require('./../services/user.service');
const {validationResult} = require('express-validator');
const ApiError = require('../exceptions/apiError');

class UserController {
  async registration(req, res, next) {
    try {
      return next(ApiError.BadRequest('Регистрация запрещена'));

      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return next(
          ApiError.BadRequest('Ошибка валидации данных', errors.array())
        );
      }

      const {username, password} = req.body;
      const userData = await userService.registration(username, password);
      res.cookie('refreshToken', userData.refreshToken, {
        maxAge: 1000 * 3600 * 24 * 30,
        httpOnly: true,
      });

      return res.json(userData);
    } catch (error) {
      next(error);
    }
  }

  async login(req, res, next) {
    try {
      const {username, password} = req.body;
      const userData = await userService.login(username, password);
      res.cookie('refreshToken', userData.refreshToken, {
        maxAge: 1000 * 3600 * 24 * 30,
        httpOnly: true,
      });

      return res.json(userData);
    } catch (error) {
      next(error);
    }
  }

  async logout(req, res, next) {
    try {
      const {refreshToken} = req.cookies;
      const token = await userService.logout(refreshToken);
      res.clearCookie('refreshToken');

      return res.json(token);
    } catch (error) {
      next(error);
    }
  }

  async refresh(req, res, next) {
    try {
      const {refreshToken} = req.cookies;
      const userData = await userService.refresh(refreshToken);
      res.cookie('refreshToken', userData.refreshToken, {
        maxAge: 1000 * 3600 * 24 * 30,
        httpOnly: true,
      });

      return res.json(userData);
    } catch (error) {
      next(error);
    }
  }

  async users(req, res, next) {
    try {
      return res.json(await userService.getAllUsers());
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new UserController();
