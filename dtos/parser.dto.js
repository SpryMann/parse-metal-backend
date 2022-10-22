module.exports = class ParserDto {
  isRunning;
  completed;
  errors;
  logs;
  lastParsingDate;

  constructor(state) {
    this.isRunning = state.isRunning;
    this.completed = state.completed;
    this.errors = state.errors;
    this.logs = state.logs;
    this.lastParsingDate = state.lastParsingDate;
  }
};
