define((require) => {
  const tdd = require('intern!tdd');

  tdd.suite('DailyGoalTest', function () {
    tdd.before(function () {
      // executes before suite starts
    });

    tdd.after(function () {
      // executes after suite ends
    });

    tdd.beforeEach(function () {
      // executes before each test
    });

    tdd.afterEach(function () {
      // executes after each test
    });

    tdd.test('Test', function () {
      return this.remote
        .get(require.toUrl('index.html'))
        .setFindTimeout(5000);
    });
  });
});
