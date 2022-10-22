const settingsService = require('./../services/settings.service');

class SettingsController {
  get(req, res, next) {
    try {
      return res.status(200).json(settingsService.get());
    } catch (error) {
      next(error);
    }
  }

  update(req, res, next) {
    try {
      settingsService.update(req.body);
      return res.status(204).json();
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new SettingsController();
