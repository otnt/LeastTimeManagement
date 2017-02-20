define(['intern!tdd', '../support/pages/dailygoalpage'], (tdd, DailyGoalPage) => {
  // const tdd = require('intern!tdd');
  // const DailyGoalPage = require('../support/pages/dailygoalpage.js');

  tdd.suite('DailyGoalTest', () => {

    let dailyGoalPage;

    tdd.before(function () {
      // executes before suite starts
    });

    tdd.after(function () {
      // executes after suite ends
    });

    tdd.beforeEach(function () {
      // executes before each test
      dailyGoalPage = new DailyGoalPage(this.remote);
    });

    tdd.afterEach(function () {
      // executes after each test
    });

    tdd.test('Test', function () {
      return this.remote
      .setFindTimeout(5000)
      .then(() => {
          return true;
        });
    });
  });
});
