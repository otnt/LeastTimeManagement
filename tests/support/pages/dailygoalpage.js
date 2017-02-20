define(function (require) {

  function DailyGoalPage(remote) {
    this.remote = remote;
  }

  DailyGoalPage.prototype = {
    constructor: DailyGoalPage,

    open: () => {
      console.log("yoyoyo");
      return this.remote
        .get("https://www.google.com");
    }
  };

  return DailyGoalPage;
});
