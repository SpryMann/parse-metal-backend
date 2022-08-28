const serverState = {
  parser: {
    isRunning: false,
    completed: true,
    errors: [],
    logs: [],
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
