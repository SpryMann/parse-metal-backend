const serverState = require('./../data/serverState');
const {scheduleParsing} = require('./../helpers/parser');

class SettingsService {
  get() {
    return serverState.settings;
  }

  update(newSettings) {
    serverState.settings.autoParsing.isEnabled =
      newSettings.autoParsing.isEnabled;
    serverState.settings.autoParsing.timeMorning =
      newSettings.autoParsing.timeMorning;
    serverState.settings.autoParsing.timeEvening =
      newSettings.autoParsing.timeEvening;
    scheduleParsing();
  }
}

module.exports = new SettingsService();
