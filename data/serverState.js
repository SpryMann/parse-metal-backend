const serverState = {
  parser: {
    isRunning: false,
    completed: true,
    errors: [],
    logs: [],
    lastParsingDate: 0,
    timeoutId: null,
  },
  settings: {
    autoParsing: {
      isEnabled: true,
      timeMorning: 6,
      timeEvening: 19,
    },
  },
};

/*
    logs: [
        {
            categoryName: 'Арматура А3',
            completed: true | false,
            success: true | false
        }
    ]
*/

module.exports = serverState;
