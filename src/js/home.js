// wait for document to load
$(document).ready(() => {
  $('#js-daily-goal').click(() => {
    window.location = './src/html/dailygoal.html';
  });

  $('#js-motivation').click(() => {
    window.location = './src/html/motivation.html';
  });
});
