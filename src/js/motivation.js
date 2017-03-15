const localforage = require('localforage');

/*
 * Prepend a leading zero to time number.
 *
 * E.g. 7 hours -> 07 hours.
 *      13 minutes -> 13 minutes.
 */
const withLeadingZero = function withLeadingZero(timeNumber) {
  return timeNumber >= 10 ? `${timeNumber}` : `0${timeNumber}`;
};

/*
 * Show a count down timer representing remaining time to finish all tasks.
 *
 * Update every second.
 */
const showTimer = function showTimer() {
  function showTimerHelp(dgTimeMs) {
    const currentTimeMs = Date.now();
    const diffDate = new Date(currentTimeMs - JSON.parse(dgTimeMs).time);
    const diffHours = 24 - diffDate.getHours() - 1,
          diffMinutes = 60 - diffDate.getMinutes() - 1,
          diffSeconds = 60 - diffDate.getSeconds() - 1;
    $('#mv-timer').text(`Time remained: ${withLeadingZero(diffHours)}:${withLeadingZero(diffMinutes)}:${withLeadingZero(diffSeconds)}`);

    // Do this again if still remain some time.
    if (diffHours + diffMinutes + diffSeconds) {
      setTimeout(showTimerHelp.bind(window, dgTimeMs), 1000);
    } else {
      // Otherwise, trigger reward or purnish.
    }
  }

  localforage.getItem('time').then((dgTimeMs) => {
    // Show immediately and every second.
    setImmediate(showTimerHelp.bind(window, dgTimeMs));
    setTimeout(showTimerHelp.bind(window, dgTimeMs), 1000 /* refresh every second */);
  }).catch((err) => {
    console.log(err);
  });
};

const showAlert = function showAlert() {
  localforage.getItem('data').then((d) => {
    const data = JSON.parse(d);

    let remain = 0;

    // Only check top level goal.
    // -1 because last task is always an empty one.
    for (let i = 0; i < data.children.length - 1; i += 1) {
        if (!data.children[i].done) {
          remain += 1;
        }
    }

    const motivationAlert = $('#mv-alert');
    if (remain) {
      motivationAlert.addClass('mv-alert-fail');
      motivationAlert.text(`You have ${remain} task(s) to go!`);
    } else {
      motivationAlert.addClass('mv-alert-pass');
      motivationAlert.text('You have done all tasks!');
    }

  }).catch((err) => {
    console.log(err);
  });
};

const showAll = function showAll() {
  showTimer();
  showAlert();
};

const init = function init() {
  $('#mv-back').click(() => {
    window.location = '../../index.html';
  });

  localforage.getItem('motivation').then((m) => {
    if (m) {
      const motivation = JSON.parse(m);
      showAll();
    } else {
      $('#mv-setup').css('display', 'block');
    }
  });
};

$(document).ready(init);
